import { Body, Controller, Delete, Post, Put, UseGuards } from '@nestjs/common';
import { UserBaseDto } from './user.dto';
import { CreateService } from './create/create.service';
import { EditService } from './edit/edit.service';
import { RemoveService } from './remove/remove.service';
import { RemoveUserDto } from './remove/remove.dto';
import { EditUserDto } from './edit/edit.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiOperation, ApiOkResponse, ApiBadRequestResponse, ApiBearerAuth } from '@nestjs/swagger';
import { User } from 'src/common/database/entities/user.entity';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private createUserService: CreateService,
    private editUserService: EditService,
    private removeUserService: RemoveService,
  ) { }

  @ApiOperation({ summary: 'create user' })
  @ApiOkResponse({
    description: "create user",
    type: User
  })
  @ApiBadRequestResponse({ description: "invalid data provided" })
  @Post('create')
  createUser(@Body() data: UserBaseDto) {
    return this.createUserService.create(data);
  }

  @ApiOperation({ summary: 'edit user' })
  @ApiOkResponse({
    description: "edit user",
    type: User
  })
  @ApiBadRequestResponse({ description: "invalid data provided" })
  @Put('edit')
  updateUser(@Body() data: EditUserDto) {
    return this.editUserService.edit(data);
  }

  @ApiOperation({ summary: 'remove user' })
  @ApiOkResponse({
    description: "remove user",
    schema: {
      type: 'string',
      example: 'Успішно',
    },
  })
  @ApiBadRequestResponse({ description: "invalid data provided" })
  @Delete('delete')
  deleteUser(@Body() data: RemoveUserDto) {
    return this.removeUserService.remove(data);
  }
}
