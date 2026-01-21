import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mqtt from 'mqtt';
import { DevicesService } from '../devices/devices.service';
import { DeviceStatus } from '../devices/device.entity';
import { LogsService } from '../logs/logs.service';
import { LogResult } from '../logs/log.entity';

@Injectable()
export class MqttService implements OnModuleInit, OnModuleDestroy {
  private client: mqtt.MqttClient | null = null;
  private isConnected = false;

  constructor(
    private configService: ConfigService,
    private devicesService: DevicesService,
    private logsService: LogsService,
  ) {}

  onModuleInit() {
    const host = this.configService.get<string>('MQTT_HOST');

    if (!host) {
      console.log('MQTT_HOST not configured, MQTT disabled');
      return;
    }

    const port = this.configService.get<number>('MQTT_PORT', 1883);
    const username = this.configService.get<string>('MQTT_USERNAME');
    const password = this.configService.get<string>('MQTT_PASSWORD');

    this.client = mqtt.connect(`mqtt://${host}:${port}`, {
      username,
      password,
      clientId: `api_${Date.now()}`,
      connectTimeout: 5000,
      reconnectPeriod: 5000,
    });

    this.client.on('connect', () => {
      console.log('MQTT connected');
      this.isConnected = true;
      this.client?.subscribe('portones/+/status');
      this.client?.subscribe('portones/+/events');
    });

    this.client.on('message', async (topic, message) => {
      const parts = topic.split('/');
      if (parts.length !== 3 || parts[0] !== 'portones') {
        return;
      }
      const deviceId = parts[1];
      const channel = parts[2];
      if (channel === 'status') {
        await this.handleStatusMessage(deviceId, message);
        return;
      }
      if (channel === 'events') {
        await this.handleEventMessage(deviceId, message);
      }
    });

    this.client.on('error', (error) => {
      console.error('MQTT error:', error.message);
      this.isConnected = false;
    });

    this.client.on('offline', () => {
      this.isConnected = false;
    });
  }

  onModuleDestroy() {
    if (this.client) {
      this.client.end();
    }
  }

  async sendCommand(deviceId: string, action: string, userId: string, requestId: string): Promise<void> {
    const topic = `portones/${deviceId}/command`;
    const payload = JSON.stringify({
      action,
      userId,
      requestId,
      timestamp: new Date().toISOString(),
    });

    if (!this.client || !this.isConnected) {
      console.log(`MQTT not connected. Command queued: ${topic}`, payload);
      return;
    }

    return new Promise((resolve, reject) => {
      this.client!.publish(topic, payload, { qos: 1 }, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  private async handleStatusMessage(deviceId: string, message: Buffer) {
    try {
      const payload = JSON.parse(message.toString());
      if (payload.status) {
        await this.devicesService.updateStatus(
          deviceId,
          payload.status === 'online' ? DeviceStatus.ONLINE : DeviceStatus.OFFLINE,
        );
      }
    } catch (error) {
      console.error('Error processing MQTT status:', error);
    }
  }

  private async handleEventMessage(deviceId: string, message: Buffer) {
    try {
      const payload = JSON.parse(message.toString());
      const eventName = typeof payload.event === 'string' ? payload.event : '';
      if (!eventName) {
        return;
      }
      const userId = typeof payload.userId === 'string' ? payload.userId : null;
      const requestId = typeof payload.requestId === 'string' ? payload.requestId : null;
      const millis = typeof payload.millis === 'number' ? payload.millis : null;
      const details = JSON.stringify({
        event: eventName,
        requestId,
        millis,
      });
      const result = eventName === 'unsupported_action' ? LogResult.ERROR : LogResult.SUCCESS;
      await this.logsService.create(userId, deviceId, eventName.toUpperCase(), result, details);
    } catch (error) {
      console.error('Error processing MQTT event:', error);
    }
  }
}
