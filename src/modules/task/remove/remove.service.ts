import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from 'src/common/database/entities/Task.entity';
import { GetOneService } from '../get-one/get-one.service';
import { TaskRemoveDto } from './remove.dto';

@Injectable()
export class RemoveService {
   constructor(
      @InjectModel(Task.name) private taskModel: Model<Task>,
      private getOneService: GetOneService
   ) { }

   async remove({ id, userId }: TaskRemoveDto): Promise<string> {
      try {
         await this.getOneService.getOne({ id, userId })

         await this.taskModel.deleteOne({ _id: id })

         return "Успішно"
      } catch (error) {
         throw error

      }
   }
}
