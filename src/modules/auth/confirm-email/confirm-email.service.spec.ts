import { Test, TestingModule } from '@nestjs/testing';
import { ConfirmEmailService } from './confirm-email.service';
import { GetOneService } from 'src/modules/user/get-one/get-one.service';
import { EditService } from 'src/modules/user/edit/edit.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('ConfirmEmailService', () => {
  let confirmEmailService: ConfirmEmailService;
  let userGetOneService: jest.Mocked<GetOneService>;
  let editUserService: jest.Mocked<EditService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfirmEmailService,
        {
          provide: GetOneService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: EditService,
          useValue: {
            edit: jest.fn(),
          },
        },
      ],
    }).compile();

    confirmEmailService = module.get<ConfirmEmailService>(ConfirmEmailService);
    userGetOneService = module.get(GetOneService);
    editUserService = module.get(EditService);
  });

  it('should be defined', () => {
    expect(confirmEmailService).toBeDefined();
    expect(userGetOneService).toBeDefined();
    expect(editUserService).toBeDefined();
  });

  it('should confirm email successfully', async () => {
    const mockDto = { email: 'test@example.com', code: 1234 };
    const mockUser = {
      email: 'test@example.com',
      code: 1234,
      isActivated: false,
      password: '',
      accessToken: '',
      refreshToken: '',
      expiryTokenDate: new Date(),
    };

    userGetOneService.findOne.mockResolvedValue(mockUser);
    editUserService.edit.mockResolvedValue(undefined);

    try {
      const result = await confirmEmailService.confirm(mockDto);

      expect(userGetOneService.findOne).toHaveBeenCalledWith(mockDto.email);
      expect(editUserService.edit).toHaveBeenCalledWith({
        email: mockDto.email,
        isActivated: true,
      });
      expect(result).toBe('Аккаунт успішно активовано');
    } catch (error) {
      console.error('Error in confirming email:', error);
      throw error;
    }
  });

  it('should throw an error if the code is incorrect', async () => {
    const mockDto = { email: 'test@gmail.com', code: 1234 };
    const mockUser = {
      email: 'test@gmail.com',
      code: 5678,
      isActivated: false,
      password: '',
      accessToken: '',
      refreshToken: '',
      expiryTokenDate: new Date(),
    };

    userGetOneService.findOne.mockResolvedValue(mockUser);

    try {
      await confirmEmailService.confirm(mockDto);
    } catch (error) {
      console.error('Error when code is incorrect:', error);
      expect(error).toEqual(
        new HttpException('Невірний код', HttpStatus.BAD_REQUEST),
      );
    }

    expect(userGetOneService.findOne).toHaveBeenCalledWith(mockDto.email);
    expect(editUserService.edit).not.toHaveBeenCalled();
  });
});
