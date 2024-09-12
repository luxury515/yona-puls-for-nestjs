import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { ProjectsModule } from './projects/projects.module';
import { IssuesModule } from './issues/issues.module';

@Module({
  imports: [DatabaseModule, UsersModule, ProjectsModule,IssuesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}