import { IsString, IsOptional } from 'class-validator';

export class CreateDeviceDto {
  @IsString()
  deviceId: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  location?: string;
}
