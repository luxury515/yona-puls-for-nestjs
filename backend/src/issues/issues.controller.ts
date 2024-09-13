import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { IssuesService } from './issues.service';

@Controller('issues')
export class IssuesController {
  private readonly logger = new Logger(IssuesController.name);

  constructor(private readonly issuesService: IssuesService) {}

  @Post()
  async create(@Body() createIssueDto: any) {
    return this.issuesService.create(createIssueDto);
  }

  @Get()
  async findAll() {
    return this.issuesService.findAll();
  }

  @Get(':issueId')
  async findOne(
    @Param('issueId') issueId: string, 
    @Query('projectId') projectId: string
  ) {
    this.logger.log(`[IssuesController] Received request for issue ${issueId} in project ${projectId}`);
    
    // projectId 검증
    if (!projectId) {
      throw new BadRequestException('Project ID is required');
    }

    // issueId와 projectId가 숫자인지 확인
    const issueIdNumber = Number(issueId);
    const projectIdNumber = Number(projectId);

    if (isNaN(issueIdNumber) || isNaN(projectIdNumber)) {
      throw new BadRequestException('Both issueId and projectId must be valid numbers');
    }

    try {
      // 이슈 찾기
      return await this.issuesService.findOne(issueIdNumber, projectIdNumber);
    } catch (error) {
      this.logger.error(`[IssuesController] Error finding issue: ${error.message}`);
      throw new NotFoundException(`Issue with ID ${issueIdNumber} in project ${projectIdNumber} not found`);
    }
  }

  

  
  @Patch(':id')
  async update(@Param('id') id: string, @Query('projectId') projectId: string, @Body() updateIssueDto: any) {
    return this.issuesService.update(+id, +projectId, updateIssueDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Query('projectId') projectId: string) {
    return this.issuesService.remove(+id, +projectId);
  }

  @Get(':id/comments')
  async getComments(@Param('id') id: string) {
    return this.issuesService.getComments(+id);
  }

  @Get(':id/children')
  async getChildIssues(@Param('id') id: string) {
    return this.issuesService.getChildIssues(+id);
  }
}
