import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LogsService } from './logs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  findAll(@Query('limit') limit?: string) {
    return this.logsService.findAll(limit ? parseInt(limit, 10) : undefined);
  }

  @Get('device/:deviceId')
  findByDevice(
    @Param('deviceId') deviceId: string,
    @Query('limit') limit?: string,
  ) {
    return this.logsService.findByDevice(
      deviceId,
      limit ? parseInt(limit, 10) : undefined,
    );
  }

  @Get('user/:userId')
  findByUser(
    @Param('userId') userId: string,
    @Query('limit') limit?: string,
  ) {
    return this.logsService.findByUser(
      userId,
      limit ? parseInt(limit, 10) : undefined,
    );
  }
}
