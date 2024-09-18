import { Controller, Post, Delete, Body, Param, Put, Get } from '@nestjs/common';
import { LabelsService } from './labels.service';

@Controller('projects/:projectId/labels')
export class LabelsController {
  constructor(private readonly labelsService: LabelsService) {}

  @Post('category')
  async createCategory(
    @Param('projectId') projectId: number,
    @Body('name') name: string
  ) {
    return this.labelsService.createCategory(projectId, name);
  }

  @Delete('category/:id')
  async deleteCategory(
    @Param('projectId') projectId: number,
    @Param('id') id: number
  ) {
    await this.labelsService.deleteCategory(projectId, id);
    return { message: '카테고리가 성공적으로 삭제되었습니다.' };
  }

  @Post()
  async createLabel(
    @Param('projectId') projectId: number,
    @Body('categoryId') categoryId: number,
    @Body('name') name: string,
    @Body('color') color: string,
  ) {
    return this.labelsService.createLabel(projectId, categoryId, name, color);
  }

  @Put(':id')
  async updateLabel(
    @Param('projectId') projectId: number,
    @Param('id') id: number,
    @Body('categoryId') categoryId: number,
    @Body('name') name: string,
    @Body('color') color: string,
  ) {
    return this.labelsService.updateLabel(projectId, id, categoryId, name, color);
  }

  @Delete(':id')
  async deleteLabel(
    @Param('projectId') projectId: number,
    @Param('id') id: number
  ) {
    await this.labelsService.deleteLabel(projectId, id);
    return { message: '라벨이 성공적으로 삭제되었습니다.' };
  }

  @Get('issues/:issueNumber')
  async getIssueLabels(
    @Param('projectId') projectId: number,
    @Param('issueNumber') issueNumber: number
  ) {
    return this.labelsService.getIssueLabels(projectId, issueNumber);
  }

  @Post('issues/:issueNumber')
  async addIssueLabel(
    @Param('projectId') projectId: number,
    @Param('issueNumber') issueNumber: number,
    @Body('labelId') labelId: number
  ) {
    return this.labelsService.addIssueLabel(projectId, issueNumber, labelId);
  }

  @Delete('issues/:issueNumber/:labelId')
  async removeIssueLabel(
    @Param('projectId') projectId: number,
    @Param('issueNumber') issueNumber: number,
    @Param('labelId') labelId: number
  ) {
    return this.labelsService.removeIssueLabel(projectId, issueNumber, labelId);
  }
}
