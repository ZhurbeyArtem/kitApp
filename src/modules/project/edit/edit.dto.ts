import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class ProjectEditDtoController {
  @ApiPropertyOptional({
    description: 'A short description of the project or task',
    example: 'test 22',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'The title of the project or task',
    example: 'hello23',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'An array of user IDs associated with the project or task',
    example: ['677c43afff5591e34cf7c9bb'],
    type: [String],
  })
  @IsString({ each: true })
  @IsOptional()
  @IsArray()
  users?: string[];

  @ApiPropertyOptional({
    description: 'The identifier of a task associated with the project',
    example: '677c42eca71f02ad7afdfd92',
    type: String,
  })
  @IsString()
  @IsOptional()
  tasks?: Types.ObjectId;
}

export class ProjectEditDtoService extends ProjectEditDtoController {
  @ApiProperty({
    description: 'The unique identifier of the project or task to be edited',
    example: '677c56934ad4b3087e46939a',
    type: String,
  })
  @IsString()
  id: Types.ObjectId;

  @ApiProperty({
    description: 'The ID of the user performing the edit operation',
    example: '677c43afff5591e34cf7c9bb',
    type: String,
  })
  @IsString()
  userId: string;
}
