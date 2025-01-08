import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { RegisterService } from './register.service';
import { CreateService } from 'src/modules/user/create/create.service';
import { GetOneService } from 'src/modules/user/get-one/get-one.service';
import { EditService } from 'src/modules/user/edit/edit.service';
import { UserBaseDto } from 'src/modules/user/user.dto';

// Mock bcrypt
jest.mock('bcryptjs');

describe('RegisterService', () => {
  let service: RegisterService;
  let createService: jest.Mocked<CreateService>;
  let editService: jest.Mocked<EditService>;
  let getOneService: jest.Mocked<GetOneService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser: UserBaseDto = {
    email: 'test@example.com',
    password: 'password123',
    // Add other required fields from UserBaseDto here
  };

  const mockTokens = {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    expiryTokenDate: new Date(),
  };

  beforeEach(async () => {
    // Create mock services
    const mockServices = {
      CreateService: {
        create: jest.fn(),
      },
      EditService: {
        edit: jest.fn(),
      },
      GetOneService: {
        findOne: jest.fn(),
      },
      JwtService: {
        sign: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterService,
        {
          provide: CreateService,
          useValue: mockServices.CreateService,
        },
        {
          provide: EditService,
          useValue: mockServices.EditService,
        },
        {
          provide: GetOneService,
          useValue: mockServices.GetOneService,
        },
        {
          provide: JwtService,
          useValue: mockServices.JwtService,
        },
      ],
    }).compile();

    service = module.get<RegisterService>(RegisterService);
    createService = module.get(CreateService);
    editService = module.get(EditService);
    getOneService = module.get(GetOneService);
    jwtService = module.get(JwtService);

    // Mock JWT service to return tokens
    jwtService.sign.mockImplementation(() => 'mock-token');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      // Mock dependencies
      getOneService.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      createService.create.mockResolvedValue({ ...mockUser, ...mockTokens, isActivated: true, code: 1234 });
      editService.edit.mockResolvedValue({ ...mockUser, ...mockTokens, isActivated: true, code: 1234 });

      // Execute test
      const result = await service.register(mockUser);

      // Verify results
      expect(getOneService.findOne).toHaveBeenCalledWith(mockUser.email, 'create');
      expect(bcrypt.hash).toHaveBeenCalledWith(mockUser.password, 5);
      expect(createService.create).toHaveBeenCalledWith({
        ...mockUser,
        password: 'hashed-password',
      });
      expect(editService.edit).toHaveBeenCalled();
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).not.toHaveProperty('expiryTokenDate');
    });

    it('should throw an error if user already exists', async () => {
      // Mock user already exists
      getOneService.findOne.mockResolvedValue({ ...mockUser, ...mockTokens, isActivated: true, code: 1234 });

      // Execute and verify error
      await expect(service.register(mockUser)).rejects.toThrow(
        new HttpException(
          'Користувач з таким емейлом вже існує',
          HttpStatus.BAD_REQUEST,
        ),
      );

      // Verify that create was not called
      expect(createService.create).not.toHaveBeenCalled();
    });

    it('should handle bcrypt hash error', async () => {
      // Mock dependencies
      getOneService.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockRejectedValue(new Error('Hash failed'));

      // Execute and verify error
      await expect(service.register(mockUser)).rejects.toThrow('Hash failed');
    });

    it('should handle create user error', async () => {
      // Mock dependencies
      getOneService.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      createService.create.mockRejectedValue(new Error('Create failed'));

      // Execute and verify error
      await expect(service.register(mockUser)).rejects.toThrow('Create failed');
    });

    it('should handle edit user error', async () => {
      // Mock dependencies
      getOneService.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      createService.create.mockResolvedValue({ ...mockUser, ...mockTokens, isActivated: true, code: 1234 });
      editService.edit.mockRejectedValue(new Error('Edit failed'));

      // Execute and verify error
      await expect(service.register(mockUser)).rejects.toThrow('Edit failed');
    });
  });
});