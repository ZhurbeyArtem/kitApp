import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from 'src/common/database/entities/project.entity';
import { GetOneService } from '../get-one/get-one.service';
import { ProjectEditDtoService } from './edit.dto';

@Injectable()
export class EditService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    private GetOneService: GetOneService
  ) { }
  async edit({ id, userId, ...data }: ProjectEditDtoService): Promise<Project> {
    try {
      const oldProject = await this.GetOneService.getOneOwner({ id, userId });

      if (data.tasks) {
        oldProject.tasks.push(data.tasks)
      }

      if (data.users)
        oldProject.users.push(...data.users)

      const updatedProject = await this.projectModel
        .findByIdAndUpdate(
          id,
          { ...data, tasks: oldProject.tasks },
          { new: true }, // Возвращает обновленный документ
        )
        .exec();

      return updatedProject;
    } catch (error) {
      throw error;
    }
  }
}
