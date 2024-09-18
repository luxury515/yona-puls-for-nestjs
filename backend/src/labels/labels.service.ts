import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Pool, RowDataPacket } from 'mysql2/promise';

@Injectable()
export class LabelsService {
  constructor(
    @Inject('DATABASE_CONNECTION')
    private connection: Pool
  ) {}

  async createCategory(projectId: number, name: string): Promise<any> {
    const [result] = await this.connection.query(
      'INSERT INTO issue_label_category (project_id, name) VALUES (?, ?)',
      [projectId, name]
    );
    const insertId = (result as any).insertId; // 'result'를 'any'로 캐스팅하여 'insertId' 속성에 접근
    return { id: insertId, projectId, name };
  }

  async deleteCategory(projectId: number, id: number): Promise<void> {
    const [result] = await this.connection.query(
      'DELETE FROM issue_label_category WHERE id = ? AND project_id = ?',
      [id, projectId]
    );
    if ((result as any).affectedRows === 0) {
      throw new NotFoundException(`프로젝트 ID ${projectId}의 카테고리 ID ${id}를 찾을 수 없습니다.`);
    }
  }

  async createLabel(projectId: number, categoryId: number, name: string, color: string): Promise<any> {
    const [category] = await this.connection.query(
      'SELECT * FROM issue_label_category WHERE id = ? AND project_id = ?',
      [categoryId, projectId]
    );
    if (!category) {
      throw new NotFoundException(`프로젝트 ID ${projectId}의 카테고리 ID ${categoryId}를 찾을 수 없습니다.`);
    }
    const [result] = await this.connection.query(
      'INSERT INTO issue_label (project_id, category_id, name, color) VALUES (?, ?, ?, ?)',
      [projectId, categoryId, name, color]
    );
    return { id: (result as any).insertId, projectId, categoryId, name, color };
  }

  async updateLabel(projectId: number, id: number, categoryId: number, name: string, color: string): Promise<any> {
    const [label] = await this.connection.query(
      'SELECT * FROM issue_label WHERE id = ? AND project_id = ?',
      [id, projectId]
    );
    if (!label) {
      throw new NotFoundException(`프로젝트 ID ${projectId}의 라벨 ID ${id}를 찾을 수 없습니다.`);
    }
    const [category] = await this.connection.query(
      'SELECT * FROM issue_label_category WHERE id = ? AND project_id = ?',
      [categoryId, projectId]
    );
    if (!category) {
      throw new NotFoundException(`프로젝트 ID ${projectId}의 카테고리 ID ${categoryId}를 찾을 수 없습니다.`);
    }
    await this.connection.query(
      'UPDATE issue_label SET category_id = ?, name = ?, color = ? WHERE id = ? AND project_id = ?',
      [categoryId, name, color, id, projectId]
    );
    return { id, projectId, categoryId, name, color };
  }

  async deleteLabel(projectId: number, id: number): Promise<void> {
    const [result] = await this.connection.query(
      'DELETE FROM issue_label WHERE id = ? AND project_id = ?',
      [id, projectId]
    );
    if ((result as any).affectedRows === 0) {
      throw new NotFoundException(`프로젝트 ID ${projectId}의 라벨 ID ${id}를 찾을 수 없습니다.`);
    }
  }

  async getIssueLabels(projectId: number, issueNumber: number) {
    const [rows] = await this.connection.query<RowDataPacket[]>(`
      SELECT 
        il.id AS label_id,
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
        i.project_id = ? AND i.number = ?
      ORDER BY 
        ilc.name, il.name
    `, [projectId, issueNumber]);
    console.log('Query result:', rows); 
    return rows;
  }

  async addIssueLabel(projectId: number, issueNumber: number, labelId: number) {
    const [issue] = await this.connection.query<RowDataPacket[]>(
      'SELECT id FROM issue WHERE project_id = ? AND number = ?',
      [projectId, issueNumber]
    );

    if (!issue[0]) {
      throw new NotFoundException('Issue not found');
    }

    await this.connection.query(
      'INSERT IGNORE INTO issue_issue_label (issue_id, issue_label_id) VALUES (?, ?)',
      [issue[0].id, labelId]
    );

    return { success: true };
  }

  async removeIssueLabel(projectId: number, issueNumber: number, labelId: number) {
    const [issue] = await this.connection.query<RowDataPacket[]>(
      'SELECT id FROM issue WHERE project_id = ? AND number = ?',
      [projectId, issueNumber]
    );

    if (!issue[0]) {
      throw new NotFoundException('Issue not found');
    }

    await this.connection.query(
      'DELETE FROM issue_issue_label WHERE issue_id = ? AND issue_label_id = ?',
      [issue[0].id, labelId]
    );

    return { success: true };
  }
}
