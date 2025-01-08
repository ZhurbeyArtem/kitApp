import { Types } from "mongoose";
import { User } from "src/common/database/entities/user.entity";

export interface IUser extends User {
  _id?: Types.ObjectId;
}