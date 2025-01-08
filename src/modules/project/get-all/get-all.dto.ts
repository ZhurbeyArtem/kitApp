import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { EStatus } from 'src/common/database/entities/Task.entity';

export class ProjectGetAllDtoController {
  @ApiPropertyOptional({
    description: 'The status of the task',
    example: 'Finished',
    enum: EStatus,
  })
  @IsOptional()
  @IsEnum(EStatus)
  @Transform(({ value }) => (value ? Number(value) : null))
  status?: EStatus;

  @ApiPropertyOptional({
    description: 'The date the task was created',
    example: '2025-01-06T21:38:03.618+00:00',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => (value ? new Date(value) : null))
  createdAt?: Date;

  @ApiPropertyOptional({
    description: 'The unique identifier of the project',
    example: '677c42eca71f02ad7afdfd92',
    type: String,
  })
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiPropertyOptional({
    description: 'The title of the task',
    example: 'test2',
    type: String,
  })
  @IsOptional()
  @IsString()
  title?: string;
}

export class ProjectGetAllDtoService extends ProjectGetAllDtoController {
  @ApiProperty({
    description: 'The unique identifier of the task owner',
    example: '677c42eca71f02ad7afdfd92',
    type: String,
  })
  @IsString()
  owner: string;

  @ApiProperty({
    description: 'The sort type -1 by decrease, 1 by increase',
    example: '1',
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  sortType?: number;
}
