import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Types } from 'mongoose';
import { EType } from 'src/modules/project/get-one/get-one.dto';

export class TaskEditDto {
  @ApiPropertyOptional({
    description: 'The title of the project, minimum 4 characters',
    example: 'Updated Project Title',
    minLength: 4,
  })
  @IsString()
  @MinLength(4)
  title?: string;

  @ApiPropertyOptional({
    description: 'An optional description of the project',
    example: 'This is an updated description of the project.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'The current status of the project',
    enum: EType,
    example: EType.create,
  })
  @IsOptional()
  @IsEnum(EType)
  status?: EType;

  @ApiProperty({
    description: 'The unique identifier of the project',
    example: '677c42eca71f02ad7afdfd92',
    type: String,
  })
  @IsString()
  id: Types.ObjectId;

  @ApiProperty({
    description: 'The unique identifier of the user editing the project',
    example: '677c43afff5591e34cf7c9bb',
    type: String,
  })
  @IsString()
  userId: string;
}
