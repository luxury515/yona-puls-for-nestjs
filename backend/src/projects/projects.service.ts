import { Injectable, Inject, Logger } from '@nestjs/common';
import { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

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
    const [rows] = await this.connection.query<RowDataPacket[]>(`
      SELECT 
        p.*, 
        COUNT(DISTINCT pu.user_id) as participant_count,
        JSON_ARRAYAGG(
          JSON_OBJECT('name', u.name)
        ) as participants
      FROM project p
      LEFT JOIN project_user pu ON p.id = pu.project_id
      LEFT JOIN n4user u ON pu.user_id = u.id
      GROUP BY p.id
      ORDER BY p.created_date DESC
    `);

    return rows.map(row => ({
      ...row,
      participants: JSON.parse(row.participants)
    }));
  }

  async getProjectIssues(projectId: number, page: number, pageSize: number, state: 'open' | 'closed' | 'draft') {
    this.logger.debug(`Fetching issues for project ${projectId}, page ${page}, pageSize ${pageSize}, state ${state}`);

    const stateMap = {
      'open': 1,
      'closed': 2,
      'draft': 7
    };

    const stateValue = stateMap[state] || 1; // 기본값은 'open'(1)

    const offset = (page - 1) * pageSize;
    const issuesQuery = `
      SELECT i.*, u.name as author_name
      FROM issue i
      LEFT JOIN n4user u ON i.author_id = u.id
      WHERE i.project_id = ? AND i.state = ?
      ORDER BY i.created_date DESC
      LIMIT ? OFFSET ?
    `;
    
    this.logger.debug(`Executing query: ${issuesQuery}`);
    this.logger.debug(`Query parameters: [${projectId}, ${stateValue}, ${pageSize}, ${offset}]`);

    const [issues] = await this.connection.query<RowDataPacket[]>(issuesQuery, [projectId, stateValue, pageSize, offset]);

    this.logger.debug(`Found ${issues.length} issues`);

    const countQuery = `SELECT COUNT(*) as count FROM issue WHERE project_id = ? AND state = ?`;
    this.logger.debug(`Executing count query: ${countQuery}`);

    const [countResult] = await this.connection.query<RowDataPacket[]>(countQuery, [projectId, stateValue]);

    const count = countResult[0].count as number;
    const totalPages = Math.ceil(count / pageSize);

    this.logger.debug(`Total issues: ${count}, Total pages: ${totalPages}`);

    return {
      issues,
      totalPages,
      currentPage: page,
      pageSize,
      totalCount: count
    };
  }
}