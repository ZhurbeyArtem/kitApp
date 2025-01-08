import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { CreateService } from './create/create.service';
import { RemoveService } from './remove/remove.service';
import { GetOneService } from './get-one/get-one.service';

import { EditService } from './edit/edit.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from 'src/common/database/entities/Task.entity';
import { AuthModule } from '../auth/auth.module';
import { ProjectModule } from '../project/project.module';

@Module({
  controllers: [TaskController],
  providers: [CreateService, RemoveService, GetOneService, EditService],
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    AuthModule,
    ProjectModule
  ]
})
export class TaskModule { }
