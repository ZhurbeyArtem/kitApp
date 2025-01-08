import { Injectable, UnauthorizedException } from '@nestjs/common';
import { GetOneService } from 'src/modules/user/get-one/get-one.service';
import { generateToken } from '../auth.utils';
import { JwtService } from '@nestjs/jwt';
import { EditService } from 'src/modules/user/edit/edit.service';
import { TokenResponse } from '../interfaces/token.interface';

@Injectable()
export class RefreshTokenService {
  constructor(
    private userGetOneService: GetOneService,
    private editUserService: EditService,
    private jwtService: JwtService,
  ) {}

  async refresh(refreshToken: string): Promise<TokenResponse> {
    try {
      const user =
        await this.userGetOneService.findOneByRefreshToken(refreshToken);
      if (!user) {
        throw new UnauthorizedException({
          message: 'Такого токену неіснує або він невірно вказаний',
        });
      }

      const tokens = generateToken(user, this.jwtService);

      await this.editUserService.edit({ ...user, ...tokens });

      return tokens;
    } catch (error) {
      throw error;
    }
  }
}
