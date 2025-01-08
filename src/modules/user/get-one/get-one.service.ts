import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/common/database/entities/user.entity';

@Injectable()
export class GetOneService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) { }

  async findOne(
    email: string,
    type: 'create' | 'find' = 'find',
  ): Promise<User | null> {
    try {
      const user = await this.userModel.findOne({ email }).exec();      
      if (!user && type === 'find') {
        throw new HttpException('Користувач з таким email не знайдений', 404);
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findOneByRefreshToken(refreshToken: string): Promise<User | null> {
    try {
      const user = await this.userModel
        .findOne({
          refreshToken,
          expiryTokenDate: { $gte: new Date() }, // MongoDB equivalent of `MoreThanOrEqual`
        })
        .exec();

      return user;
    } catch (error) {
      throw error;
    }
  }
}
