import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log, LogResult } from './log.entity';

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(Log)
    private logsRepository: Repository<Log>,
  ) {}

  async create(
    userId: string,
    deviceId: string,
    action: string,
    result: LogResult,
    details?: string,
  ): Promise<Log> {
    const log = this.logsRepository.create({
      userId,
      deviceId,
      action,
      result,
      details,
    });
    return this.logsRepository.save(log);
  }

  async findAll(limit = 100): Promise<Log[]> {
    return this.logsRepository.find({
      relations: ['user', 'device'],
      order: { timestamp: 'DESC' },
      take: limit,
    });
  }

  async findByDevice(deviceId: string, limit = 50): Promise<Log[]> {
    return this.logsRepository.find({
      where: { deviceId },
      relations: ['user'],
      order: { timestamp: 'DESC' },
      take: limit,
    });
  }

  async findByUser(userId: string, limit = 50): Promise<Log[]> {
    return this.logsRepository.find({
      where: { userId },
      relations: ['device'],
      order: { timestamp: 'DESC' },
      take: limit,
    });
  }
}
