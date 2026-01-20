import { IsString } from 'class-validator';

export class OpenGateDto {
  @IsString()
  deviceId: string;
}
