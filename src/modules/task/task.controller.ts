import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { CreateService } from './create/create.service';
import { EditService } from './edit/edit.service';

import { GetOneService } from './get-one/get-one.service';
import { RemoveService } from './remove/remove.service';
import { AuthGuard } from '../auth/auth.guard';
import { ParseObjectIdPipe } from 'src/utils/ObjectIdPipe';
import { Types } from 'mongoose';
import { TaskCreateDtoController } from './create/create.dto';

@UseGuards(AuthGuard)
@Controller('task')
export class TaskController {
  constructor(
    private createTaskService: CreateService,
    private editTaskService: EditService,
    private getOneTaskService: GetOneService,
    private removeTaskService: RemoveService,
  ) { }

  @Post('create')
  createTask(@Body() data: TaskCreateDtoController, @Request() req) {
    const userId = req.user.id
    return this.createTaskService.create({ ...data, userId });
  }


  @Get('/:id')
  getOne(@Param('id', ParseObjectIdPipe) id: Types.ObjectId, @Request() req) {
    const userId = req.user.id
    return this.getOneTaskService.getOne({ id, userId });
  }


  @Put('/:id')
  updateUser(@Body() data, @Param('id', ParseObjectIdPipe) id: Types.ObjectId, @Request() req) {
    const userId = req.user.id
    return this.editTaskService.edit({ id, userId, ...data });
  }


  @Delete('/:id')
  deleteUser(@Param('id', ParseObjectIdPipe) id: Types.ObjectId, @Request() req) {
    const userId = req.user.id
    return this.removeTaskService.remove({ id, userId });
  }
}
