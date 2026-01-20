import { IsEmail, IsEnum, IsOptional, MinLength } from 'class-validator';
import { UserRole } from '../user.entity';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
