import { Injectable, NotFoundException, Inject, Logger } from '@nestjs/common';
import { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { CommentDto } from './dto/CommentDto';

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
    const [rows] = await this.connection.execute<RowDataPacket[]>(
      `SELECT i.*, p.name as project_name
       FROM issue i
       JOIN project p ON i.project_id = p.id
       WHERE i.number = ? AND i.project_id = ?`,
      [issueId, projectId]
    );
    if (rows.length === 0) {
      throw new NotFoundException(`Issue with ID ${issueId} in project ${projectId} not found`);
    }
    return rows[0];
  }

  async update(projectId: number, issueId: number, updateIssueDto: any): Promise<any> {
    const { title, body, ...otherFields } = updateIssueDto;
    
    const updateFields = [];
    const updateValues = [];

    if (title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(title);
    }

    if (body !== undefined) {
      updateFields.push('body = ?');
      updateValues.push(body);
    }

    // 다른 필드들에 대해서도 같은 방식으로 처리
    for (const [key, value] of Object.entries(otherFields)) {
      if (value !== undefined) {
        updateFields.push(`${key} = ?`);
        updateValues.push(value);
      }
    }

    updateFields.push('updated_date = NOW()');

    if (updateFields.length === 0) {
      throw new Error('No fields to update');
    }

    const query = `
      UPDATE issue
      SET ${updateFields.join(', ')}
      WHERE number = ? AND project_id = ?
    `;

    updateValues.push(issueId, projectId);

    try {
      const [result] = await this.connection.execute(query, updateValues);
      if ((result as ResultSetHeader).affectedRows === 0) {
        throw new NotFoundException(`Issue with ID ${issueId} in project ${projectId} not found`);
      }
      return result;
    } catch (error) {
      this.logger.error(`Error updating issue: ${error.message}`, error.stack);
      throw new Error('Failed to update issue');
    }
  }

  async remove(id: number, projectId: number): Promise<void> {
    await this.connection.execute('DELETE FROM issue WHERE id = ? AND project_id = ?', [id, projectId]);
  }

  async getComments(issueId: number, projectId: number): Promise<CommentDto[]> {
    const [rows]: [RowDataPacket[], any] = await this.connection.execute<RowDataPacket[]>(`
      SELECT ic.*, u.name as author_name
      FROM issue_comment ic
      LEFT JOIN n4user u ON ic.author_id = u.id
      JOIN issue i ON ic.issue_id = i.id
      JOIN project p ON i.project_id = p.id
      WHERE p.id = ? AND i.number = ?
      ORDER BY ic.created_date 
    `, [projectId, issueId]);

    if (rows.length === 0) {
      this.logger.warn(`[IssuesService] Issue with ID ${issueId} in project ${projectId} not found`);
    }

    this.logger.log(`[IssuesService] Comments for issue ${issueId} in project ${projectId}: ${JSON.stringify(rows)}`);

    return this.buildCommentTree(rows.map(row => new CommentDto(row)));
  }

  private buildCommentTree(comments: CommentDto[]): CommentDto[] {
    const commentMap = new Map<number, CommentDto>();
    const rootComments: CommentDto[] = [];

    comments.forEach(comment => {
      commentMap.set(comment.id, comment);
      comment.children = [];  // children 배열 초기화
    });

    comments.forEach(comment => {
      if (comment.parent_comment_id === null) {
        rootComments.push(comment);
      } else {
        const parentComment = commentMap.get(comment.parent_comment_id);
        if (parentComment && parentComment.children) {
          parentComment.children.push(comment);
        }
      }
    });

    return rootComments;
  }

  async getChildIssues(parentId: number): Promise<any[]> {
    const [rows] = await this.connection.execute('SELECT * FROM issue WHERE parent_id = ?', [parentId]);
    return rows as any[];
  }

  async addComment(projectId: number, issueNumber: number, userId: number, contents: string, parentCommentId: number | null): Promise<ResultSetHeader> {
    console.log('addComment 함수 호출됨');
    console.log('projectId:', projectId);
    console.log('issueNumber:', issueNumber);
    console.log('userId:', userId);
    console.log('contents:', contents);
    console.log('parentCommentId:', parentCommentId);
    
    const [issueRows] = await this.connection.execute<RowDataPacket[]>(
      'SELECT id FROM issue WHERE project_id = ? AND number = ?',
      [projectId, issueNumber]
    );

    if (issueRows.length === 0) {
      throw new NotFoundException(`Issue with number ${issueNumber} in project ${projectId} not found`);
    }

    const issueId = issueRows[0].id;

    let query = 'INSERT INTO issue_comment (issue_id, author_id, contents, project_id, parent_comment_id, created_date) VALUES (?, ?, ?, ?, ?, NOW())';
    let params = [issueId, userId, contents, projectId, parentCommentId];

    const [result] = await this.connection.execute<ResultSetHeader>(query, params);

    return result;
  }

  async updateComment(projectId: number, issueNumber: number, commentId: number, userId: number, contents: string): Promise<ResultSetHeader> {
    const [commentRows] = await this.connection.execute<RowDataPacket[]>(
      'SELECT * FROM issue_comment WHERE id = ? AND author_id = ?',
      [commentId, userId]
    );

    if (commentRows.length === 0) {
      throw new NotFoundException('Comment not found or user is not the author');
    }

    const [result] = await this.connection.execute<ResultSetHeader>(
      'UPDATE issue_comment SET contents = ? WHERE id = ?',
      [contents, commentId]
    );

    return result;
  }

  async deleteComment(projectId: number, issueNumber: number, commentId: number, userId: number): Promise<void> {
    const [commentRows] = await this.connection.execute<RowDataPacket[]>(
      'SELECT * FROM issue_comment WHERE id = ? AND author_id = ?',
      [commentId, userId]
    );

    if (commentRows.length === 0) {
      throw new NotFoundException('Comment not found or user is not the author');
    }

    await this.connection.execute('DELETE FROM issue_comment WHERE id = ?', [commentId]);
  }

  async getIssueLabels(issueNumber: number, projectId: number): Promise<RowDataPacket[]> {
    this.logger.log(`Fetching labels for issueNumber: ${issueNumber}, projectId: ${projectId}`);
    
    const sql = `
      SELECT 
        il.name AS label_name,
        ilc.name AS category_name,
        il.color AS label_color
      FROM 
        issue i
      JOIN 
        issue_issue_label iil ON i.id = iil.issue_id
      JOIN 
        issue_label il ON iil.issue_label_id = il.id
      LEFT JOIN 
        issue_label_category ilc ON il.category_id = ilc.id
      WHERE 
        i.project_id = ?
        AND i.number = ?
      ORDER BY 
        ilc.name, il.name;
    `;
    
    const [rows] = await this.connection.execute<RowDataPacket[]>(sql, [projectId, issueNumber]);
    this.logger.log(`Labels fetched: ${JSON.stringify(rows)}`);
    
    return rows;
  }

  async addLabelToIssue(issueNumber: number, projectId: number, labelId: number): Promise<RowDataPacket> {
    this.logger.log(`Adding label ${labelId} to issue ${issueNumber} in project ${projectId}`);
    
    // 1. 이슈 ID 가져오기
    const [issueRows] = await this.connection.execute<RowDataPacket[]>(
      'SELECT id FROM issue WHERE number = ? AND project_id = ?',
      [issueNumber, projectId]
    );
    
    if (issueRows.length === 0) {
      throw new NotFoundException(`Issue with number ${issueNumber} in project ${projectId} not found`);
    }
    
    const issueId = issueRows[0].id;
    
    // 2. 라벨이 존재하는지 확인
    const [labelRows] = await this.connection.execute<RowDataPacket[]>(
      'SELECT * FROM issue_label WHERE id = ? AND project_id = ?',
      [labelId, projectId]
    );
    
    if (labelRows.length === 0) {
      throw new NotFoundException(`Label with ID ${labelId} in project ${projectId} not found`);
    }
    
    // 3. 이슈와 라벨 연결
    await this.connection.execute(
      'INSERT IGNORE INTO issue_issue_label (issue_id, issue_label_id) VALUES (?, ?)',
      [issueId, labelId]
    );
    
    return labelRows[0];
  }

  async removeLabelFromIssue(issueNumber: number, labelId: number, projectId: number): Promise<void> {
    this.logger.log(`Removing label ${labelId} from issue ${issueNumber} in project ${projectId}`);
    
    // 1. 이슈 ID 가져오기
    const [issueRows] = await this.connection.execute<RowDataPacket[]>(
      'SELECT id FROM issue WHERE number = ? AND project_id = ?',
      [issueNumber, projectId]
    );
    
    if (issueRows.length === 0) {
      throw new NotFoundException(`Issue with number ${issueNumber} in project ${projectId} not found`);
    }
    
    const issueId = issueRows[0].id;
    
    // 2. 이슈와 라벨의 연결 제거
    await this.connection.execute(
      'DELETE FROM issue_issue_label WHERE issue_id = ? AND issue_label_id = ?',
      [issueId, labelId]
    );
  }

  async searchLabels(projectId: number, search: string): Promise<RowDataPacket[]> {
    this.logger.log(`Searching labels in project ${projectId} with query: ${search}`);
    
    const sql = `
      SELECT 
        il.id,
        il.name AS label_name,
        il.color AS label_color,
        ilc.name AS category_name
      FROM 
        issue_label il
      LEFT JOIN 
        issue_label_category ilc ON il.category_id = ilc.id
      WHERE 
        il.project_id = ?
        AND il.name LIKE ?
      ORDER BY 
        ilc.name, il.name;
    `;
    
    const [rows] = await this.connection.execute<RowDataPacket[]>(sql, [projectId, `%${search}%`]);
    this.logger.log(`Labels found: ${JSON.stringify(rows)}`);
    
    return rows;
  }
}