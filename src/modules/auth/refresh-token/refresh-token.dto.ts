import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshTokenDto {

  @ApiProperty({
    description: "the refresh token",
    required: true,
    example: "20b39c2a-7917-4825-8a84-f1872beaf8a1"
  })
  @IsString()
  refreshToken: string;
}
