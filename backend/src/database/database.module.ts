import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from './database.service';
import * as mysql from 'mysql2/promise';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async () => {
        const connection = await mysql.createConnection({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          timezone: '+09:00', // KST 시간대 설정
          dateStrings: true, // 날짜를 문자열로 반환
        });
        return connection;
      },
    },
    DatabaseService,
  ],
  exports: ['DATABASE_CONNECTION'],
})
export class DatabaseModule {}