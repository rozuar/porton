import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device, DeviceStatus } from './device.entity';
import { CreateDeviceDto } from './dto/create-device.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(Device)
    private devicesRepository: Repository<Device>,
  ) {}

  async create(createDeviceDto: CreateDeviceDto): Promise<Device> {
    const existing = await this.devicesRepository.findOne({
      where: { deviceId: createDeviceDto.deviceId },
    });

    if (existing) {
      throw new ConflictException('Device ID already exists');
    }

    const device = this.devicesRepository.create({
      ...createDeviceDto,
      mqttUsername: `device_${createDeviceDto.deviceId}`,
      mqttPassword: randomBytes(16).toString('hex'),
    });

    return this.devicesRepository.save(device);
  }

  async findAll(): Promise<Device[]> {
    return this.devicesRepository.find();
  }

  async findOne(id: string): Promise<Device | null> {
    return this.devicesRepository.findOne({ where: { id } });
  }

  async findByDeviceId(deviceId: string): Promise<Device | null> {
    return this.devicesRepository.findOne({ where: { deviceId } });
  }

  async updateStatus(deviceId: string, status: DeviceStatus): Promise<Device> {
    const device = await this.findByDeviceId(deviceId);
    if (!device) {
      throw new NotFoundException('Device not found');
    }
    device.status = status;
    return this.devicesRepository.save(device);
  }
}
