import { IsOptional, Matches } from 'class-validator';

export class UpdatePermissionDto {
  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'fromTime must be in HH:mm format',
  })
  fromTime?: string;

  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'toTime must be in HH:mm format',
  })
  toTime?: string;

  @IsOptional()
  isActive?: boolean;
}
