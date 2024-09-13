import { Module } from '@nestjs/common';
import { LabelsController } from './labels.controller';
import { LabelsService } from './labels.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [LabelsController],
  providers: [LabelsService],
})
export class LabelsModule {}
