import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { Types } from 'mongoose';

export class ProjectCreateDto {
  @ApiProperty({
    description: 'The title of the project, must be at least 4 characters long',
    example: 'test2',
  })
  @IsString()
  @MinLength(4, { message: 'The project title must be at least 4 characters long' })
  title: string;

  @ApiPropertyOptional({
    description: 'A short description of the project',
    example: 'test 2222',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'The identifier of the project owner',
    example: '677c42eca71f02ad7afdfd92',
    type: String,
  })
  @IsOptional()
  owner?: Types.ObjectId;
}
