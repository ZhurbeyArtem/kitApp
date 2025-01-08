import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export enum EType {
  create = 'create',
  find = 'find',
}

export class ProjectGetOneDto {
  @ApiProperty({
    description: 'The unique identifier of the item',
    example: '677c42eca71f02ad7afdfd92',
    type: String,
  })
  @IsString()
  id: Types.ObjectId;

  @ApiProperty({
    description: 'The unique identifier of the user',
    example: '677c42eca71f02ad7afdfd92',
    type: String,
  })
  @IsString()
  userId: string;

  @ApiPropertyOptional({
    description: 'The type of operation to perform',
    example: 'find',
    enum: EType,
  })
  @IsEnum(EType)
  @IsOptional()
  type?: EType;
}
