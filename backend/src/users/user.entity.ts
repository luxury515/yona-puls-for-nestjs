import { RowDataPacket } from 'mysql2';

export interface User extends RowDataPacket {
  id: number;
  login_id: string;
  name: string;
  email: string;
  password: string;
  password_salt: string;
  refresh_token?: string;
  reset_token?: string;
  reset_token_expires?: Date;
  state: string;
  created_date: Date;
}