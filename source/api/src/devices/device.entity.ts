import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Permission } from '../permissions/permission.entity';
import { Log } from '../logs/log.entity';

export enum DeviceStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  UNKNOWN = 'unknown',
}

@Entity('devices')
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  deviceId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'enum', enum: DeviceStatus, default: DeviceStatus.UNKNOWN })
  status: DeviceStatus;

  @Column({ nullable: true })
  mqttUsername: string;

  @Column({ nullable: true })
  mqttPassword: string;

  @OneToMany(() => Permission, (permission) => permission.device)
  permissions: Permission[];

  @OneToMany(() => Log, (log) => log.device)
  logs: Log[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
