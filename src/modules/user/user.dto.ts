import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class UserBaseDto {
  @ApiProperty({
    description: "the user email",
    required: true,
    example: "test@gmail.com"
  })
  @IsEmail({}, { message: 'Введіть коректний email' })
  @IsNotEmpty({ message: "Поле email обов'язкове" })
  email: string;

  @ApiProperty({
    description: "the user password",
    required: true,
    example: "qwerty123"
  })
  @MinLength(8, {
    message: 'Мінімальна довжина паролю повинна бути не менш ніж 8 символів',
  })
  @IsNotEmpty({ message: "Поле пароль обов'язкове" })
  password: string;
}


export class UserResponseDto {
  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
  })
  password: string;

  @ApiProperty({
    description: 'User activation status',
    example: false,
  })
  isActivated: boolean;

  @ApiProperty({
    description: 'User verification code',
    example: 1234,
  })
  code: number;

  @ApiProperty({
    description: 'User access token',
    example: 'access_token_example',
    required: false,
  })
  accessToken?: string;

  @ApiProperty({
    description: 'User refresh token',
    example: 'refresh_token_example',
    required: false,
  })
  refreshToken?: string;

  @ApiProperty({
    description: 'User token expiry date',
    example: '2025-01-01T00:00:00Z',
    required: false,
  })
  expiryTokenDate?: Date;
}