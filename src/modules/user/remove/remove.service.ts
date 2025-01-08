import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/common/database/entities/user.entity';
import { RemoveUserDto } from './remove.dto';

@Injectable()
export class RemoveService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) { }

  async remove({ email }: RemoveUserDto): Promise<string> {
    try {
      const result = await this.userModel.deleteOne({ email }).exec();
      if (result.deletedCount === 0) {
        throw new Error('Користувач з таким email не знайдений');
      }
      return 'Успішно';
    } catch (error) {
      throw error;
    }
  }
}
