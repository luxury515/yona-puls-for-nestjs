import { Injectable, Inject } from '@nestjs/common';
import * as mysql from 'mysql2/promise';

@Injectable()
export class DatabaseService {
  constructor(
    @Inject('DATABASE_CONNECTION') private readonly connection: mysql.Connection,
  ) {}

  async query(sql: string, params: any[] = []): Promise<any> {
    return this.connection.query(sql, params);
  }

  async getConnection(): Promise<mysql.Connection> {
    return this.connection;
  }
}