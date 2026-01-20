import { Module } from '@nestjs/common';
import { GatesService } from './gates.service';
import { GatesController } from './gates.controller';
import { MqttModule } from '../mqtt/mqtt.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { DevicesModule } from '../devices/devices.module';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [MqttModule, PermissionsModule, DevicesModule, LogsModule],
  controllers: [GatesController],
  providers: [GatesService],
})
export class GatesModule {}
