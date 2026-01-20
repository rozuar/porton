import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { DevicesModule } from './devices/devices.module';
import { PermissionsModule } from './permissions/permissions.module';
import { LogsModule } from './logs/logs.module';
import { AuthModule } from './auth/auth.module';
import { MqttModule } from './mqtt/mqtt.module';
import { GatesModule } from './gates/gates.module';
import { User } from './users/user.entity';
import { Device } from './devices/device.entity';
import { Permission } from './permissions/permission.entity';
import { Log } from './logs/log.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        entities: [User, Device, Permission, Log],
        synchronize: true, // Disable in production
        ssl: configService.get('DATABASE_URL')?.includes('sslmode=require')
          ? { rejectUnauthorized: false }
          : false,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    DevicesModule,
    PermissionsModule,
    LogsModule,
    AuthModule,
    MqttModule,
    GatesModule,
  ],
})
export class AppModule {}
