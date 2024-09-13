import { Injectable, NotFoundException, Inject, Logger } from '@nestjs/common';
import { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';

@Injectable()
export class IssuesService {
  private readonly logger = new Logger(IssuesService.name);

  constructor(@Inject('DATABASE_CONNECTION') private connection: Pool) {}

  async create(createIssueDto: any): Promise<ResultSetHeader> {
    const [result] = await this.connection.execute<ResultSetHeader>(
      'INSERT INTO issue (title, body, created_date, updated_date, author_id, author_login_id, author_name, project_id, number, num_of_comments, state) VALUES (?, ?, NOW(), NOW(), ?, ?, ?, ?, ?, 0, 0)',
      [createIssueDto.title, createIssueDto.body, createIssueDto.author_id, createIssueDto.author_login_id, createIssueDto.author_name, createIssueDto.project_id, createIssueDto.number]
    );
    return result;
  }

  async findAll(): Promise<RowDataPacket[]> {
    const [rows] = await this.connection.execute<RowDataPacket[]>('SELECT * FROM issue');
    return rows;
  }

  async findOne(issueId: number, projectId: number): Promise<RowDataPacket> {
    this.logger.log(`[IssuesService] Searching for issue ${issueId} in project ${projectId}`);
    const [rows] = await this.connection.execute<RowDataPacket[]>(
      'SELECT * FROM issue WHERE number = ? AND project_id = ?',
      [issueId, projectId]
    );
    if (rows.length === 0) {
      this.logger.warn(`[IssuesService] Issue with ID ${issueId} in project ${projectId} not found`);
      throw new NotFoundException(`Issue with ID ${issueId} in project ${projectId} not found`);
    }
    this.logger.log(`[IssuesService] Issue found: ${JSON.stringify(rows[0])}`);
    return rows[0];
  }

  async update(id: number, projectId: number, updateIssueDto: any): Promise<any> {
    const [result] = await this.connection.execute(
      'UPDATE issue SET title = ?, body = ?, updated_date = NOW(), state = ? WHERE id = ? AND project_id = ?',
      [updateIssueDto.title, updateIssueDto.body, updateIssueDto.state, id, projectId]
    );
    return result;
  }

  async remove(id: number, projectId: number): Promise<void> {
    await this.connection.execute('DELETE FROM issue WHERE id = ? AND project_id = ?', [id, projectId]);
  }

  async getComments(issueId: number): Promise<any[]> {
    const [rows] = await this.connection.execute('SELECT * FROM issue_comment WHERE issue_id = ?', [issueId]);
    return rows as any[];
  }

  async getChildIssues(parentId: number): Promise<any[]> {
    const [rows] = await this.connection.execute('SELECT * FROM issue WHERE parent_id = ?', [parentId]);
    return rows as any[];
  }
}