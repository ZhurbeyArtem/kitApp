import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project } from 'src/common/database/entities/project.entity';
import { EType, ProjectGetOneDto } from './get-one.dto';

@Injectable()
export class GetOneService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>
  ) { }

  async getOne({ id, userId, type = EType.find }: ProjectGetOneDto): Promise<Project> {
    try {

      const project = await this.projectModel.aggregate([
        {
          $match: {
            _id: new Types.ObjectId(id),
            users: userId,
          
          },
        },
        {
          $lookup: {
            from: 'tasks', 
            localField: 'tasks', 
            foreignField: '_id', 
            as: 'tasks', 
          },
        },
        {
          $addFields: {
            tasks: { $ifNull: ['$tasks', []] },
          },
        },
      ])

      if (!project[0] && type === EType.find) {
        throw new HttpException(
          'Проєкт за таким ід не знайдений або в вас не має доступу до нього',
          HttpStatus.NOT_FOUND,
        );
      }

      return project[0];
    } catch (error) {
      throw error;
    }
  }

  async getOneOwner({ id, userId, type = EType.find }: ProjectGetOneDto): Promise<Project> {
    try {
      const project = await this.projectModel.findOne({ _id: id, owner: userId }).exec();

      if (!project && type === EType.find) {
        throw new HttpException(
          'Проєкт за таким ід не знайдений або ви не є власником цього проєкту',
          HttpStatus.NOT_FOUND,
        );
      }

      return project;
    } catch (error) {
      throw error;
    }
  }

}
