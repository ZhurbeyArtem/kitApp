import { Test, TestingModule } from '@nestjs/testing';
import { RefreshTokenService } from './refresh-token.service';
import { GetOneService } from 'src/modules/user/get-one/get-one.service';
import { EditService } from 'src/modules/user/edit/edit.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as authUtils from '../auth.utils'; // Import the generateToken utility
import { TokenResponse } from '../interfaces/token.interface';

jest.mock('src/modules/user/get-one/get-one.service');
jest.mock('src/modules/user/edit/edit.service');
jest.mock('@nestjs/jwt');
jest.mock('../auth.utils', () => ({
  generateToken: jest.fn(),
}));

describe('RefreshTokenService', () => {
  let refreshTokenService: RefreshTokenService;
  let userGetOneService: GetOneService;
  let editUserService: EditService;
  let jwtService: JwtService;
  let generateToken: jest.Mock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenService,
        GetOneService,
        EditService,
        JwtService,
      ],
    }).compile();

    refreshTokenService = module.get<RefreshTokenService>(RefreshTokenService);
    userGetOneService = module.get<GetOneService>(GetOneService);
    editUserService = module.get<EditService>(EditService);
    jwtService = module.get<JwtService>(JwtService);

    generateToken = authUtils.generateToken as jest.Mock;  // Mocked generateToken function
  });

  it('should return new tokens when refresh token is valid', async () => {
    const refreshToken = 'valid_refresh_token';
    const mockUser = { id: 1, email: 'test@example.com' };
    const mockTokens: TokenResponse = {
      accessToken: 'new_access_token',
      refreshToken: 'new_refresh_token',
      expiryTokenDate: new Date(),
    };

    // Mock services
    userGetOneService.findOneByRefreshToken = jest.fn().mockResolvedValue(mockUser);
    generateToken.mockReturnValue(mockTokens);  // Mock token generation
    editUserService.edit = jest.fn().mockResolvedValue({ ...mockUser, ...mockTokens });

    const result = await refreshTokenService.refresh(refreshToken);

    expect(result).toEqual(mockTokens);
    expect(userGetOneService.findOneByRefreshToken).toHaveBeenCalledWith(refreshToken); // Ensure token was checked
    expect(generateToken).toHaveBeenCalledWith(mockUser, jwtService); // Ensure token generation
    expect(editUserService.edit).toHaveBeenCalledWith({ ...mockUser, ...mockTokens }); // Ensure user info was updated
  });

  it('should throw UnauthorizedException if refresh token is invalid', async () => {
    const refreshToken = 'invalid_refresh_token';

    // Mock service to return null when no user is found with the refresh token
    userGetOneService.findOneByRefreshToken = jest.fn().mockResolvedValue(null);

    await expect(refreshTokenService.refresh(refreshToken)).rejects.toThrow(UnauthorizedException);
    await expect(refreshTokenService.refresh(refreshToken)).rejects.toThrowError(
      'Такого токену неіснує або він невірно вказаний',
    );
    expect(userGetOneService.findOneByRefreshToken).toHaveBeenCalledWith(refreshToken); // Ensure token was checked
  });

  it('should handle unexpected errors during refresh', async () => {
    const refreshToken = 'any_token';
    const mockError = new Error('Unexpected error');

    // Mock service to throw an error
    userGetOneService.findOneByRefreshToken = jest.fn().mockRejectedValue(mockError);

    await expect(refreshTokenService.refresh(refreshToken)).rejects.toThrowError(mockError);
  });
});
