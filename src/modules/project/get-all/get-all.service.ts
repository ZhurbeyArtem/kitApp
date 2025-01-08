import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from 'src/common/database/entities/project.entity';
import { ProjectGetAllDtoService } from './get-all.dto';

@Injectable()
export class GetAllService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
  ) { }

  async getAll({ owner, status, createdAt, title, sortType }: ProjectGetAllDtoService): Promise<Project[]> {
    try {
      const query: any = [{
        $match: {
          users: owner, // фильтрация по пользователю
          // добавьте другие фильтры, если нужно
        },
      },
      {
        $lookup: {
          from: 'tasks', // коллекция задач
          localField: 'tasks', // поле в коллекции проектов
          foreignField: '_id', // поле в коллекции задач
          as: 'tasks', // имя поля для хранения данных
        },
      },
      {
        $addFields: {
          tasks: { $ifNull: ['$tasks', []] }, // если нет задач, вернуть пустой массив
        },
      }
      ]

      if (status || title || createdAt) {
        const sortStage = { $sort: {} };

        if (status) {
          sortStage.$sort['tasks.status'] = Number(sortType) || 1;
       
            query.push({
              $match: {
                tasks: { $elemMatch: { status: { $eq: Number(status) } } }, // Проверка, что хотя бы одна задача имеет нужный статус
              },
            });
         

        }
        if (title) {
          sortStage.$sort['title'] = Number(sortType) || 1;
          query[0].$match["title"] = { $regex: title, $options: 'i' }

        }
        if (createdAt) {
          sortStage.$sort['createdAt'] = Number(sortType) || 1;
          query[0].$match["createdAt"] = createdAt

        }
        query.push(sortStage);

      }

      const projects = await this.projectModel.aggregate(query);

      if (!projects || projects.length === 0) {
        throw new HttpException(
          'Ваш список проєктів поки що пустий, створіть свій або попросіть щоб вас добавили в проєкт',
          HttpStatus.NOT_FOUND,
        );
      }

      return projects;
    } catch (error) {
      if(error.status === 404) throw error
      throw new HttpException(
        'Помилка при отриманні проєктів',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
