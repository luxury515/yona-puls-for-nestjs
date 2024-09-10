import { Injectable, Inject } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';

@Injectable()
export class ProjectsService {
  constructor(
    @Inject('DATABASE_CONNECTION')
    private connection: Pool
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<CreateProjectDto & { id: number }> {
    const conn = await this.connection.getConnection();
    try {
      await conn.beginTransaction();

      const [result] = await conn.query<ResultSetHeader>(
        'INSERT INTO project (name, overview, vcs, project_scope) VALUES (?, ?, ?, ?)',
        [createProjectDto.name, createProjectDto.description, createProjectDto.vcsType, createProjectDto.publicScope]
      );

      const projectId = result.insertId;

      await conn.query(
        'INSERT INTO project_menu_setting (project_id, code, issue, pull_request, review, milestone, board) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [projectId, createProjectDto.code, createProjectDto.issue, createProjectDto.pullRequest, createProjectDto.review, createProjectDto.milestone, createProjectDto.board]
      );

      await conn.commit();
      return { id: projectId, ...createProjectDto };
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }
}