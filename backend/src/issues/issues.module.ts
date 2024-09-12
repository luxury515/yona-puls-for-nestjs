import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { IssuesController } from './issues.controller';
import { IssuesService } from './issues.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [IssuesController],
  providers: [IssuesService],
})
export class IssuesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req, res, next) => {
        console.log(`[IssuesModule] Request reached IssuesModule: ${req.method} ${req.url}`);
        next();
      })
      .forRoutes(IssuesController);
  }
}