import { Test, TestingModule } from '@nestjs/testing';
import { LoginService } from './login.service';
import { GetOneService } from 'src/modules/user/get-one/get-one.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UnauthorizedException } from '@nestjs/common';
import { UserBaseDto } from 'src/modules/user/user.dto';
import { TokenResponse } from '../interfaces/token.interface';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

describe('LoginService', () => {
  let loginService: LoginService;
  let userGetOneService: jest.Mocked<GetOneService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginService,
        {
          provide: GetOneService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    loginService = module.get<LoginService>(LoginService);
    userGetOneService = module.get(GetOneService);
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(loginService).toBeDefined();
  });

  it('should throw an error if the password is incorrect', async () => {
    const mockUser = {
      email: 'test@example.com',
      password: 'hashed_password',
      isActivated: true,
    };
    const data: UserBaseDto = {
      email: 'test@example.com',
      password: 'wrongpassword',
    };

    userGetOneService.findOne.mockResolvedValue(mockUser as any);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    try {
      await loginService.login(data);
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error.message).toBe('Неправильний емейл або пароль');
    }
  });

  it('should throw an error if the user is not found', async () => {
    const data: UserBaseDto = {
      email: 'notfound@example.com',
      password: 'password123',
    };
    userGetOneService.findOne.mockResolvedValue(null);
    await expect(loginService.login(data)).rejects.toBeInstanceOf(TypeError);
  });
});
