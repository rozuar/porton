import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { GatesService } from './gates.service';
import { OpenGateDto } from './dto/open-gate.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('gates')
@UseGuards(JwtAuthGuard)
export class GatesController {
  constructor(private readonly gatesService: GatesService) {}

  @Post('open')
  openGate(@Request() req, @Body() openGateDto: OpenGateDto) {
    return this.gatesService.openGate(req.user.id, openGateDto.deviceId);
  }
}
