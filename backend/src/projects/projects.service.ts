import { Injectable, Inject } from '@nestjs/common';
import { Pool, ResultSetHeader } from 'mysql2/promise';
import { CreateProjectDto } from './dto/create-project.dto';

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

  async getAllProjects() {
    const [rows] = await this.connection.query(`
      SELECT p.*, 
             COUNT(DISTINCT pu.user_id) as participant_count,
             GROUP_CONCAT(DISTINCT u.name ORDER BY u.name SEPARATOR ',') as participant_names
      FROM project p
      LEFT JOIN project_user pu ON p.id = pu.project_id
      LEFT JOIN n4user u ON pu.user_id = u.id
      GROUP BY p.id
      ORDER BY p.created_date DESC
    `);
    return rows;
  }

  async getProjectIssues(projectId: number) {
    const [rows] = await this.connection.query(`
      SELECT i.*, u.name as author_name
      FROM issue i
      LEFT JOIN n4user u ON i.author_id = u.id
      WHERE i.project_id = ?
      ORDER BY i.created_date DESC
    `, [projectId]);
    return rows;
  }
}