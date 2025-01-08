import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { SwaggerModule } from './swagger/swagger.module';

@Module({
  imports: [DatabaseModule, SwaggerModule],
})
export class CommonModule {}
