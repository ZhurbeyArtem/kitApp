import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { CreateService } from './create/create.service';
import { EditService } from './edit/edit.service';
import { RemoveService } from './remove/remove.service';
import { ProjectCreateDto } from './create/create.dto';
import { AuthGuard } from '../auth/auth.guard';
import { GetAllService } from './get-all/get-all.service';
import { GetOneService } from './get-one/get-one.service';
import { ParseObjectIdPipe } from 'src/utils/ObjectIdPipe';
import { ProjectGetAllDtoController } from './get-all/get-all.dto';
import { ProjectEditDtoController } from './edit/edit.dto';
import { Types } from 'mongoose';

@UseGuards(AuthGuard)
@Controller('project')
export class ProjectController {
  constructor(
    private createProjectService: CreateService,
    private editProjectService: EditService,
    private getAllProjectsService: GetAllService,
    private getOneProjectService: GetOneService,
    private removeProjectService: RemoveService,
  ) { }

  @Post('create')
  createProject(@Body() data: ProjectCreateDto, @Request() req) {
    const owner = req.user.id
    return this.createProjectService.create({ ...data, owner });
  }

  @Get('/')
  getAll(@Query() data: ProjectGetAllDtoController, @Request() req) {
    const owner = req.user.id
    return this.getAllProjectsService.getAll({ ...data, owner });
  }

  @Get('/:id')
  getOne(@Param('id', ParseObjectIdPipe) id: Types.ObjectId, @Request() req) {
    const userId = req.user.id
    return this.getOneProjectService.getOne({ id, userId });
  }


  @Put('/:id')
  updateUser(@Body() data: ProjectEditDtoController, @Param('id', ParseObjectIdPipe) id: Types.ObjectId, @Request() req) {
    const userId = req.user.id
    return this.editProjectService.edit({ id, userId, ...data });
  }


  @Delete('/:id')
  deleteUser(@Param('id', ParseObjectIdPipe) id: Types.ObjectId, @Request() req) {
    const userId = req.user.id
    return this.removeProjectService.remove({ id, userId });
  }
}
