import { Test, TestingModule } from '@nestjs/testing';
import { RegisterService } from './register.service';
import { CreateService } from 'src/modules/user/create/create.service';
import { GetOneService } from 'src/modules/user/get-one/get-one.service';
import { EditService } from 'src/modules/user/edit/edit.service';
import { JwtService } from '@nestjs/jwt';
import { UserBaseDto } from 'src/modules/user/user.dto';
import * as bcrypt from 'bcryptjs';
import { HttpException, HttpStatus } from '@nestjs/common';
import { generateToken } from '../auth.utils';
import { TokenResponse } from '../interfaces/token.interface';

jest.mock('bcryptjs');
jest.mock('src/modules/user/create/create.service');
jest.mock('src/modules/user/get-one/get-one.service');
jest.mock('src/modules/user/edit/edit.service');
jest.mock('@nestjs/jwt');
jest.mock('../auth.utils');

describe('RegisterService', () => {
  let registerService: RegisterService;
  let createService: CreateService;
  let getOneService: GetOneService;
  let editService: EditService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterService,
        CreateService,
        GetOneService,
        EditService,
        JwtService,
      ],
    }).compile();

    registerService = module.get<RegisterService>(RegisterService);
    createService = module.get<CreateService>(CreateService);
    getOneService = module.get<GetOneService>(GetOneService);
    editService = module.get<EditService>(EditService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should throw an error if the user already exists', async () => {
    const data: UserBaseDto = { email: 'test@example.com', password: 'password123' };
    getOneService.findOne = jest.fn().mockResolvedValue(true); // Mock that the user exists

    await expect(registerService.register(data)).rejects.toThrow(
      new HttpException('Користувач з таким емейлом вже існує', HttpStatus.BAD_REQUEST),
    );
  });

  it('should successfully register a user and return tokens', async () => {
    const data: UserBaseDto = { email: 'test@example.com', password: 'password123' };
    const mockUser = { email: 'test@example.com', password: 'hashed_password', isActivated: true };
    const mockTokenResponse: TokenResponse = {
      accessToken: 'mocked_token',
      refreshToken: 'mocked_refresh_token',
      expiryTokenDate: new Date('2025-01-08T17:26:42.149Z'),
    };

    getOneService.findOne = jest.fn().mockResolvedValue(null); // Mock user does not exist
    createService.create = jest.fn().mockResolvedValue(mockUser); // Mock user creation
    bcrypt.hash = jest.fn().mockResolvedValue('hashed_password'); // Mock password hashing
    jest.spyOn(require('../auth.utils'), 'generateToken').mockReturnValue(mockTokenResponse); // Mock token generation
    editService.edit = jest.fn().mockResolvedValue(mockUser); // Mock user update

    const result = await registerService.register(data);

    expect(result).toEqual(mockTokenResponse);
    expect(getOneService.findOne).toHaveBeenCalledWith(data.email, 'create');
    expect(createService.create).toHaveBeenCalledWith({
      ...data,
      password: 'hashed_password',
    });
    expect(generateToken).toHaveBeenCalledWith(mockUser, jwtService);
    expect(editService.edit).toHaveBeenCalledWith({ ...mockUser, ...mockTokenResponse });
  });

  it('should handle unexpected errors during registration', async () => {
    const data: UserBaseDto = { email: 'test@example.com', password: 'password123' };
    getOneService.findOne = jest.fn().mockRejectedValue(new Error('Unexpected error'));

    await expect(registerService.register(data)).rejects.toBeInstanceOf(TypeError);
  });
});
