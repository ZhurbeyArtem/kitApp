import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class ConfirmEmailDto {

  @ApiProperty({
    description: "the user email",
    required: true,
    example: "test@gmail.com"
  })
  @IsEmail({}, { message: 'Введіть коректний email' })
  @IsNotEmpty({ message: "Поле email обов'язкове" })
  email: string;

  @ApiProperty({
    description: "the code to activate account",
    required: true,
    example: 3453
  })
  @IsNotEmpty({ message: "Поле код обов'язкове" })
  @IsNumber()
  code: number;
}
