import { Module } from '@nestjs/common';
import { createPool } from 'mysql2/promise';

@Module({
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: () => {
        const connection = createPool({
          host: 'localhost',
          user: 'root',
          password: 'root',
          database: 'yona_db',
          connectionLimit: 10,
        });
        return connection;
      },
    },
  ],
  exports: ['DATABASE_CONNECTION'], // 다른 모듈에서 사용할 수 있도록 내보냅니다.
})
export class DatabaseModule {}