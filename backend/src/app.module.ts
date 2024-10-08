import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ProjectsModule } from './projects/projects.module';
import { LabelsModule } from './labels/labels.module';
import { UsersModule } from './users/users.module';
import { IssuesModule } from './issues/issues.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    ProjectsModule,
    UsersModule,
    LabelsModule,
    IssuesModule,
    // ... 다른 모듈들
  ],
  // ... 
})
export class AppModule {}