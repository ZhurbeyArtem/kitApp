import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { Types } from "mongoose";

export class ProjectRemoveDto {
  @ApiProperty({
    description: 'The unique identifier of the project',
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
}