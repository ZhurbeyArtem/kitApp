import { Injectable } from '@nestjs/common';
import { GetOneService } from '../get-one/get-one.service';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from 'src/common/database/entities/Task.entity';
import { Model } from 'mongoose';
import { TaskEditDto } from './edit.dto';

@Injectable()
export class EditService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    private getOneService: GetOneService,
  ) { }

  async edit({ id, userId, ...data }: TaskEditDto): Promise<Task> {
    try {
      await this.getOneService.getOne({ id, userId });

      const updatedProject = await this.taskModel
        .findByIdAndUpdate(
          id,
          { ...data },
          { new: true },
        )
        .exec();

      return updatedProject;
    } catch (error) {
      throw error;
    }
  }
}
