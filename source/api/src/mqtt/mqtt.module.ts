import { Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { DevicesModule } from '../devices/devices.module';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [DevicesModule, LogsModule],
  providers: [MqttService],
  exports: [MqttService],
})
export class MqttModule {}
