import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from 'src/common/database/entities/project.entity';
import { ProjectRemoveDto } from './remove.dto';
import { GetOneService } from '../get-one/get-one.service';

@Injectable()
export class RemoveService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    private GetOneService: GetOneService
  ) { }

  async remove({ id, userId }: ProjectRemoveDto): Promise<string> {
    try {
       await this.GetOneService.getOneOwner({ id, userId });

      await this.projectModel.deleteOne({ _id: id }).exec();

      return "Успішно"
    } catch (error) {
      throw error;
    }
  }
}
