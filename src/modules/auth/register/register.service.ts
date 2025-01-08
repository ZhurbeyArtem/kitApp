import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { CreateService } from 'src/modules/user/create/create.service';
import { GetOneService } from 'src/modules/user/get-one/get-one.service';
import { UserBaseDto } from 'src/modules/user/user.dto';

import { generateToken } from '../auth.utils';
import { TokenResponse } from '../interfaces/token.interface';
import { EditService } from 'src/modules/user/edit/edit.service';


@Injectable()
export class RegisterService {
  constructor(
    private creteUserService: CreateService,
    private editUserService: EditService,
    private userGetOneService: GetOneService,
    private jwtService: JwtService,
  ) { }

  async register(data: UserBaseDto): Promise<TokenResponse> {
    try {
      const candidate = await this.userGetOneService.findOne(
        data.email,
        'create',
      );
      if (candidate)
        throw new HttpException(
          'Користувач з таким емейлом вже існує',
          HttpStatus.BAD_REQUEST,
        );
      const hashPassword = await bcrypt.hash(data.password, 5);
      const user = await this.creteUserService.create({
        ...data,
        password: hashPassword,
      });
      const tokens = generateToken(user, this.jwtService);

      await this.editUserService.edit({ ...user, ...tokens });

      delete tokens.expiryTokenDate;

      return tokens;
    } catch (error) {
      throw error;
    }
  }
}
