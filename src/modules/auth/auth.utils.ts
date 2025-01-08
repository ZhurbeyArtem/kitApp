import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { IUser } from '../user/interfaces/user.interface';
import { User } from 'src/common/database/entities/user.entity';


export const generateToken = (data: IUser, jwtService: JwtService) => {
  const payload = {
    email: data.email,
    id: data._id,
    isActivated: data.isActivated,
  };
  const refreshToken = uuidv4();
  const expiryTokenDate = new Date();
  expiryTokenDate.setDate(expiryTokenDate.getDate() + 3);
  return {
    accessToken: jwtService.sign(payload),
    refreshToken: refreshToken,
    expiryTokenDate,
  };
};
