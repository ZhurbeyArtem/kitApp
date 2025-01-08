import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEmail } from 'class-validator';

export class NotificationDto {
  @ApiProperty({
    description: 'Message Title',
    example: 'Реєстрація',
  })
  @IsString({ message: 'Введіть коректний заговолок' })
  @IsNotEmpty({ message: "Поле title обов'язкове" })
  title: string;

  @ApiProperty({
    description: 'Random 4 Digit Number',
    example: 1234,
  })
  @IsNumber({}, { message: 'Введіть коректний код має бути число з 4х чисел' })
  @IsNotEmpty({ message: "Поле code обов'язкове" })
  code: number;

  @ApiProperty({
    description: 'User`s email ',
    example: 'test@gmail.com',
  })
  @IsEmail({}, { message: 'Введіть коректний email' })
  @IsNotEmpty({ message: "Поле email обов'язкове" })
  email: string;
}
