import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export type TaskDocument = Task & Document;

export enum EStatus {
  NewTask,
  InProcess,
  Finished
}

@Schema()
export class Task {
  @Prop({ required: true, })
  @IsString()
  @MinLength(4)
  title: string;

  @Prop()
  @IsString()
  @IsOptional()
  description?: string;

  @Prop({default: EStatus.NewTask})
  @IsEnum(EStatus)
  status: EStatus;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  project: Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
