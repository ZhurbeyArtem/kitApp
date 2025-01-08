import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from 'src/common/database/entities/Task.entity';
import { GetOneService as GetOneProjectService } from 'src/modules/project/get-one/get-one.service'
import { TaskGetOneDto } from './get-one.dto';
@Injectable()
export class GetOneService {

  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    private getOneProjectService: GetOneProjectService
  ) { }

  async getOne({ id, userId }: TaskGetOneDto): Promise<Task>  {
    try {
      const task = await this.taskModel.findById(id)
      if (!task) {
        throw new HttpException(
          'Задача за таким ід не знайдена',
          HttpStatus.NOT_FOUND,
        );
      }
      await this.getOneProjectService.getOneOwner({ id: task.project, userId })

      return task
    } catch (error) {
      throw error
    }

  }
}
