import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsDate, IsEmail, IsNumber, IsString, MinLength } from 'class-validator';
import { Types } from 'mongoose';

export type UserDocument = User & Document;
@Schema()
export class User {
  @Prop({ required: true, unique: true })
  @IsEmail()
  email: string;

  @Prop({ required: true })
  @MinLength(8)
  password: string;

  @Prop({ default: false })
  @IsBoolean()
  isActivated: boolean;

  @Prop({ required: true })
  @IsNumber()
  code: number;

  @Prop({ default: "" })
  @IsString()
  accessToken: string;

  @Prop({ default: "" })
  @IsString()
  refreshToken: string;

  @Prop({ default: new Date() })
  @IsDate()
  expiryTokenDate: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
