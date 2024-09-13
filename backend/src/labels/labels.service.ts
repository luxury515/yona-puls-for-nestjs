import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Pool } from 'mysql2/promise';

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
}
