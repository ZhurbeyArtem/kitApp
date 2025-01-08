import { Module } from '@nestjs/common';

import { CommonModule } from './common/common.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { NotificationModule } from './modules/notification/notification.module';
import { TaskModule } from './modules/task/task.module';
import { ProjectModule } from './modules/project/project.module';


@Module({
  imports: [
    CommonModule,
    AuthModule,
    UserModule,
    TaskModule,
    ProjectModule,
    // NotificationModule,

  ],
})
export class AppModule {}
