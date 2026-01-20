import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Device } from '../devices/device.entity';

export enum LogResult {
  SUCCESS = 'success',
  DENIED = 'denied',
  ERROR = 'error',
}

@Entity('logs')
export class Log {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.logs, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @ManyToOne(() => Device, (device) => device.logs, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'device_id' })
  device: Device;

  @Column({ name: 'device_id', nullable: true })
  deviceId: string;

  @Column()
  action: string;

  @Column({ type: 'enum', enum: LogResult })
  result: LogResult;

  @Column({ nullable: true })
  details: string;

  @CreateDateColumn()
  timestamp: Date;
}
