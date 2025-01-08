import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { EditService } from './edit/edit.service';
import { RemoveService } from './remove/remove.service';
import { CreateService } from './create/create.service';
import { GetOneService } from './get-one/get-one.service';
import { GetAllService } from './get-all/get-all.service';
import { Project, ProjectSchema } from 'src/common/database/entities/project.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [ProjectController],
  providers: [EditService, RemoveService, CreateService, GetOneService, GetAllService],
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    AuthModule
  ],
  exports: [
    EditService, GetOneService
  ]
})
export class ProjectModule {}
