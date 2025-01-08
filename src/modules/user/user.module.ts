import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateService } from './create/create.service';
import { EditService } from './edit/edit.service';
import { RemoveService } from './remove/remove.service';
import { GetOneService } from './get-one/get-one.service';
import { UserController } from './user.controller';
import { NotificationModule } from '../notification/notification.module';
import { AuthModule } from '../auth/auth.module';
import { User, UserSchema } from 'src/common/database/entities/user.entity';

@Module({
  providers: [CreateService, EditService, RemoveService, GetOneService],
  controllers: [UserController],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    NotificationModule,
    forwardRef(() => AuthModule),
  ],
  exports: [CreateService, EditService, RemoveService, GetOneService],
})
export class UserModule { }
