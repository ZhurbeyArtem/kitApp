import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from 'src/common/database/entities/project.entity';
import { ProjectCreateDto } from './create.dto';

@Injectable()
export class CreateService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>
  ) { }

  async create(data: ProjectCreateDto): Promise<Project> {
    try {
      const project = await this.projectModel.create({ ...data, users: [data.owner] });
      console.log(project);
      
      return  project;
    } catch (error) {
      throw error;
    }
  }
}
