import { Test, TestingModule } from '@nestjs/testing';
import { ResendCodeService } from './resend-code.service';
import { NotificationService } from 'src/modules/notification/notification.service';
import { EditService } from 'src/modules/user/edit/edit.service';
import { GetOneService } from 'src/modules/user/get-one/get-one.service';
import { ResendCodeDto } from './resend-code.dto';
import * as userUtils from 'src/modules/user/user.utils';  // Import the module containing generateCode

jest.mock('src/modules/notification/notification.service');
jest.mock('src/modules/user/edit/edit.service');
jest.mock('src/modules/user/get-one/get-one.service');
jest.mock('src/modules/user/user.utils', () => ({
  generateCode: jest.fn(),
}));

describe('ResendCodeService', () => {
  let resendCodeService: ResendCodeService;
  let notificationService: NotificationService;
  let editUserService: EditService;
  let userGetOneService: GetOneService;
  let generateCode: jest.Mock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResendCodeService,
        NotificationService,
        EditService,
        GetOneService,
      ],
    }).compile();

    resendCodeService = module.get<ResendCodeService>(ResendCodeService);
    notificationService = module.get<NotificationService>(NotificationService);
    editUserService = module.get<EditService>(EditService);
    userGetOneService = module.get<GetOneService>(GetOneService);

    generateCode = userUtils.generateCode as jest.Mock;  // Get the mocked function
  });


  it('should successfully resend the code and send email', async () => {
    const data: ResendCodeDto = { email: 'test@example.com' };
    const mockCode = 1234; // Mock the generated code
    const mockUser = { email: 'test@example.com' };

    userGetOneService.findOne = jest.fn().mockResolvedValue(mockUser); // Simulating user found
    generateCode.mockReturnValue(mockCode); // Mock code generation
    editUserService.edit = jest.fn().mockResolvedValue({ ...mockUser, code: mockCode }); // Mock user update
    notificationService.sendEmail = jest.fn().mockResolvedValue('Email sent'); // Mock email sending

    const result = await resendCodeService.resendCode(data);

    expect(result).toBe('Код успішно відправлений на пошту');
    expect(userGetOneService.findOne).toHaveBeenCalledWith(data.email); // Check if user was found
    expect(generateCode).toHaveBeenCalled(); // Ensure code generation was called
    expect(editUserService.edit).toHaveBeenCalledWith({ email: data.email, code: mockCode }); // Ensure user update was called
    expect(notificationService.sendEmail).toHaveBeenCalledWith({
      email: data.email,
      code: mockCode,
      title: 'Код для підтвердження пошти',
    }); // Ensure email was sent
  });

  it('should handle unexpected errors during resend', async () => {
    const data: ResendCodeDto = { email: 'test@example.com' };
    userGetOneService.findOne = jest.fn().mockRejectedValue(new Error('Unexpected error'));

    await expect(resendCodeService.resendCode(data)).rejects.toBeInstanceOf(Error);
  });
});
