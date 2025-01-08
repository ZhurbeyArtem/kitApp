import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from 'src/common/database/entities/Task.entity';
import { EditService } from 'src/modules/project/edit/edit.service';
import { TaskCreateDtoService } from './create.dto';

@Injectable()
export class CreateService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    private editProjectService: EditService,
  ) { }

  async create({ userId, ...data }: TaskCreateDtoService): Promise<Task> {
    try {
      const task = await this.taskModel.create(data);

      await this.editProjectService.edit({ id: data.project, userId, tasks: task._id })

      return task;
    } catch (error) {
      throw error;
    }
  }
}
