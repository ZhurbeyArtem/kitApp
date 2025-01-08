import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { IsArray, IsOptional, IsString, Min } from 'class-validator';
import { User } from './user.entity';

export type ProjectDocument = Project & Document;

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true })
  @IsString()
  @Min(4)
  title: string;

  @Prop()
  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @Prop({ default: [] })
  users: string[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: User;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Task' }], default: [] })
  tasks: Types.ObjectId[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
