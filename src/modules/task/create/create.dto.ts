import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { Types } from 'mongoose';

export class TaskCreateDtoController {
  @ApiProperty({
    description: 'The title of the entity, minimum 4 characters',
    example: 'New Project Title',
    minLength: 4,
  })
  @IsString()
  @MinLength(4)
  title: string;

  @ApiPropertyOptional({
    description: 'An optional description of the entity',
    example: 'This is a detailed description of the project.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The unique identifier of the associated project',
    example: '677c42eca71f02ad7afdfd92',
    type: String,
  })
  @IsString()
  project: Types.ObjectId;
}

export class TaskCreateDtoService extends TaskCreateDtoController {
  @ApiProperty({
    description: 'The unique identifier of the user creating the entity',
    example: '677c42eca71f02ad7afdfd92',
    type: String,
  })
  @IsString()
  userId: string;
}
