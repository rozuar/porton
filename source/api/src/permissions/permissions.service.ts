import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

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

  async checkAccess(
    userId: string,
    deviceId: string,
  ): Promise<{ allowed: boolean; reason?: string; fromTime?: string; toTime?: string }> {
    const permission = await this.findByUserAndDevice(userId, deviceId);

    if (!permission) {
      return { allowed: false, reason: 'no_permission' };
    }

    if (!permission.fromTime || !permission.toTime) {
      return { allowed: true };
    }

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const allowed = currentTime >= permission.fromTime && currentTime <= permission.toTime;
    if (!allowed) {
      return {
        allowed: false,
        reason: 'outside_schedule',
        fromTime: permission.fromTime,
        toTime: permission.toTime,
      };
    }
    return { allowed: true };
  }

  async remove(id: string): Promise<void> {
    const result = await this.permissionsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Permission not found');
    }
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto): Promise<Permission> {
    const permission = await this.permissionsRepository.findOne({
      where: { id },
    });

    if (!permission) {
      throw new NotFoundException('Permiso no encontrado');
    }

    await this.permissionsRepository.update(id, updatePermissionDto);
    const updated = await this.permissionsRepository.findOne({
      where: { id },
      relations: ['user', 'device'],
    });

    if (!updated) {
      throw new NotFoundException('Permiso no encontrado después de actualizar');
    }

    return updated;
  }
}
