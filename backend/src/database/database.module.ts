import { Module } from '@nestjs/common';
import { createPool } from 'mysql2/promise';

@Module({
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async () => {
        const pool = createPool({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          timezone: '+09:00', // KST 시간대 설정
          dateStrings: true, // 날짜를 문자열로 반환
        });
        return pool;
      },
    },
  ],
  exports: ['DATABASE_CONNECTION'],
})
export class DatabaseModule {}