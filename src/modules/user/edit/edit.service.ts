import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/common/database/entities/user.entity';
import { EditUserDto } from './edit.dto';

@Injectable()
export class EditService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) { }

  async edit(data: EditUserDto): Promise<User> {
    try {
      // console.log(data);

      const user = await this.userModel
        .findOneAndUpdate(
          { email: data.email }, // Filter by email
          { $set: data }, // Update fields
          { new: true }, // Return the updated document
        )
        .exec();

      return user;
    } catch (error) {
      throw error;
    }
  }
}
