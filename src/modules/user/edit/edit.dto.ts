import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class EditUserDto {
  @ApiProperty({
    description: 'The user email address',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Введіть коректний email' })
  @IsNotEmpty({ message: "Поле email обов'язкове" })
  email: string;

  @ApiPropertyOptional({
    description: 'The user password (optional)',
    example: 'strongPassword123',
    minLength: 8,
  })
  @MinLength(8, {
    message: 'Мінімальна довжина паролю повинна бути не менш ніж 8 символів',
  })
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({
    description: 'User account activation status',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isActivated?: boolean;

  @ApiPropertyOptional({
    description: 'Confirmation code (optional)',
    example: 1234,
  })
  @IsNumber()
  @IsOptional()
  code?: number;

  @ApiPropertyOptional({
    description: 'Access token (optional)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  @IsOptional()
  accessToken?: string;

  @ApiPropertyOptional({
    description: 'Refresh token (optional)',
    example: 'dQw4w9WgXcQ0FV1eLnsq4zQrs2RlXf6qTS',
  })
  @IsString()
  @IsOptional()
  refreshToken?: string;

  @ApiPropertyOptional({
    description: 'Expiry date of the access token (optional)',
    example: '2025-01-01T00:00:00Z',
  })
  @IsDate()
  @IsOptional()
  expiryTokenDate?: Date;
}
