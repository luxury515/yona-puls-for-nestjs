import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ProjectsModule } from './projects/projects.module';
import { LabelsModule } from './labels/labels.module';
// ... 다른 import 문

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    ProjectsModule,
    LabelsModule,
    // ... 다른 모듈들
  ],
  // ... 
})
export class AppModule {}