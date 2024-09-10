import { Module } from '@nestjs/common';
import { createPool } from 'mysql2/promise';

@Module({
  imports: [],
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async () => {
        return createPool({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT, 10),
        });
      },
      inject: [],
    },
  ],
  exports: ['DATABASE_CONNECTION'],
})
export class DatabaseModule {}