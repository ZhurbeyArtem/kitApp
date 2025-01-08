import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EditService } from 'src/modules/user/edit/edit.service';
import { GetOneService } from 'src/modules/user/get-one/get-one.service';
import { ConfirmEmailDto } from './confirm-email.dto';

@Injectable()
export class ConfirmEmailService {
  constructor(
    private userGetOneService: GetOneService,
    private editUserService: EditService,
  ) {}

  async confirm(data: ConfirmEmailDto): Promise<string> {
    try {
      const user = await this.userGetOneService.findOne(data.email);
      if (user.code !== data.code) {
        throw new HttpException('Невірний код', HttpStatus.BAD_REQUEST);
      }
      await this.editUserService.edit({ email: data.email, isActivated: true });
      return 'Аккаунт успішно активовано';
    } catch (error) {
      throw error;
    }
  }
}
