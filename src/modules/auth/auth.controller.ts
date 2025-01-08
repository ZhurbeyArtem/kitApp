import { Body, Controller, HttpException, Post, Put } from '@nestjs/common';
import { UserBaseDto } from '../user/user.dto';
import { LoginService } from './login/login.service';
import { RegisterService } from './register/register.service';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { RefreshTokenDto } from './refresh-token/refresh-token.dto';
import { ConfirmEmailService } from './confirm-email/confirm-email.service';
import { ConfirmEmailDto } from './confirm-email/confirm-email.dto';
import { ResendCodeDto } from './resend-code/resend-code.dto';
import { ResendCodeService } from './resend-code/resend-code.service';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TokenResponse } from './interfaces/token.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private loginService: LoginService,
    private registerService: RegisterService,
    private refreshTokenService: RefreshTokenService,
    private confirmEmailService: ConfirmEmailService,
    private resendCodeService: ResendCodeService,
  ) { }

  @Post('login')
  @ApiOperation({ summary: 'login user' })
  @ApiOkResponse({
    description: "user logined",
    type: TokenResponse
  })
  @ApiBadRequestResponse({ description: "invalid data provided" })
  login(@Body() data: UserBaseDto) {
    return this.loginService.login(data);
  }

  @Post('register')
  @ApiOperation({ summary: 'register user' })
  @ApiOkResponse({
    description: "user registered",
    type: TokenResponse
  })
  @ApiBadRequestResponse({ description: "invalid data provided" })
  register(@Body() data: UserBaseDto) {
    return this.registerService.register(data);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'refresh tokens' })
  @ApiOkResponse({
    description: "refresh tokens",
    type: TokenResponse
  })
  @ApiBadRequestResponse({ description: "invalid data provided" })
  refreshTokens(@Body() data: RefreshTokenDto) {
    return this.refreshTokenService.refresh(data.refreshToken);
  }

  @Post('confirmEmail')
  @ApiOperation({ summary: 'confirm email' })
  @ApiOkResponse({
    description: "confirm email / activate account",
    schema: {
      type: 'string',
      example: 'Аккаунт успішно активовано',
    },
  })
  @ApiBadRequestResponse({ description: "invalid data provided" })
  confirmEmail(@Body() data: ConfirmEmailDto) {
    return this.confirmEmailService.confirm(data);
  }

  @Put('resendCode')
  @ApiOperation({ summary: 'resend email message' })
  @ApiOkResponse({
    description: "resend email message",
    schema: {
      type: 'string',
      example: 'Код успішно відправлений на пошту',
    },
  })
  @ApiBadRequestResponse({ description: "invalid data provided"})
  resendCode(@Body() data: ResendCodeDto) {
    return this.resendCodeService.resendCode(data);
  }
}
