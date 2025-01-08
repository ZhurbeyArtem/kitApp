import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/common/database/entities/user.entity';
import { UserBaseDto } from '../user.dto';
import { NotificationService } from 'src/modules/notification/notification.service';
import { generateCode } from '../user.utils';

@Injectable()
export class CreateService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private notificationService: NotificationService,
  ) { }

  async create(data: UserBaseDto): Promise<User> {
    try {
      const code = generateCode();

      await this.notificationService.sendEmail({
        email: data.email,
        code,
        title: 'Код для реєстрації в додатку',
      });
      const user = await this.userModel.create({ ...data, code });
      return user.toObject();
    } catch (error) {
      throw error;
    }
  }
}
