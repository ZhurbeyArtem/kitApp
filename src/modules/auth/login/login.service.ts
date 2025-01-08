import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { GetOneService } from 'src/modules/user/get-one/get-one.service';
import { UserBaseDto } from 'src/modules/user/user.dto';
import { generateToken } from '../auth.utils';
import { JwtService } from '@nestjs/jwt';
import { TokenResponse } from '../interfaces/token.interface';

@Injectable()
export class LoginService {
  constructor(
    private userGetOneService: GetOneService,
    private jwtService: JwtService,
  ) {}

  async login(data: UserBaseDto): Promise<TokenResponse> {
    try {
      const user = await this.userGetOneService.findOne(data.email);
      if (!user.isActivated) {
        throw new HttpException(
          'Спочатку потрібно активувати аккаунт',
          HttpStatus.FORBIDDEN,
        );
      }
      const passwordEquals = await bcrypt.compare(data.password, user.password);
      if (user && passwordEquals) return generateToken(user, this.jwtService);
      throw new UnauthorizedException({
        message: 'Неправильний емейл або пароль',
      });
    } catch (error) {
      throw error;
    }
  }
}
