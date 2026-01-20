import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const permission = this.permissionsRepository.create(createPermissionDto);
    return this.permissionsRepository.save(permission);
  }

  async findAll(): Promise<Permission[]> {
    return this.permissionsRepository.find({
      relations: ['user', 'device'],
    });
  }

  async findByUserAndDevice(userId: string, deviceId: string): Promise<Permission | null> {
    return this.permissionsRepository.findOne({
      where: { userId, deviceId, isActive: true },
    });
  }

  async checkAccess(userId: string, deviceId: string): Promise<boolean> {
    const permission = await this.findByUserAndDevice(userId, deviceId);

    if (!permission) {
      return false;
    }

    if (!permission.fromTime || !permission.toTime) {
      return true;
    }

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    return currentTime >= permission.fromTime && currentTime <= permission.toTime;
  }

  async remove(id: string): Promise<void> {
    const result = await this.permissionsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Permission not found');
    }
  }
}
