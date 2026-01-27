import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { MqttService } from '../mqtt/mqtt.service';
import { PermissionsService } from '../permissions/permissions.service';
import { DevicesService } from '../devices/devices.service';
import { LogsService } from '../logs/logs.service';
import { LogResult } from '../logs/log.entity';

@Injectable()
export class GatesService {
  constructor(
    private mqttService: MqttService,
    private permissionsService: PermissionsService,
    private devicesService: DevicesService,
    private logsService: LogsService,
  ) {}

  async openGate(userId: string, deviceId: string) {
    const device = await this.devicesService.findByDeviceId(deviceId);

    if (!device) {
      throw new NotFoundException('Device not found');
    }

    const access = await this.permissionsService.checkAccess(userId, device.id);

    if (!access.allowed) {
      const reasonMessage = access.reason === 'outside_schedule'
        ? `Outside allowed time (${access.fromTime}-${access.toTime})`
        : 'Permission denied';
      await this.logsService.create(
        userId,
        device.id,
        'OPEN',
        LogResult.DENIED,
        reasonMessage,
      );
      throw new ForbiddenException(reasonMessage);
    }

    const requestId = randomUUID();

    try {
      await this.mqttService.sendCommand(deviceId, 'OPEN', userId, requestId);

      await this.logsService.create(
        userId,
        device.id,
        'OPEN',
        LogResult.SUCCESS,
        `Request ID: ${requestId}`,
      );

      return {
        success: true,
        requestId,
        message: 'Command sent successfully',
      };
    } catch (error) {
      await this.logsService.create(
        userId,
        device.id,
        'OPEN',
        LogResult.ERROR,
        error.message,
      );

      throw error;
    }
  }
}
