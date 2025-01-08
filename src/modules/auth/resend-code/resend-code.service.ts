import { Injectable } from '@nestjs/common';

import { NotificationService } from 'src/modules/notification/notification.service';
import { generateCode } from 'src/modules/user/user.utils';
import { ResendCodeDto } from './resend-code.dto';
import { EditService } from 'src/modules/user/edit/edit.service';
import { GetOneService } from 'src/modules/user/get-one/get-one.service';

@Injectable()
export class ResendCodeService {
  constructor(private notificationService: NotificationService,
    private editUserService: EditService,
    private userGetOneService: GetOneService
  ) { }
  async resendCode({ email }: ResendCodeDto):Promise<string> {
    try {

      await this.userGetOneService.findOne(
        email
      );

      const code = generateCode();

      await this.editUserService.edit({ email, code });

      await this.notificationService.sendEmail({
        email: email,
        code,
        title: 'Код для підтвердження пошти',
      });

      return 'Код успішно відправлений на пошту'
    } catch (error) {
      throw error
    }
  }
}
