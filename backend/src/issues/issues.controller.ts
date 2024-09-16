import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Logger, BadRequestException, NotFoundException, Put, InternalServerErrorException } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { CommentDto } from './dto/CommentDto';

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
      const issue = await this.issuesService.findOne(issueIdNumber, projectIdNumber);
      if (!issue) {
        throw new NotFoundException(`Issue with ID ${issueIdNumber} in project ${projectIdNumber} not found`);
      }
      return issue;
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
  async getComments(
    @Param('id') id: string, // 이슈 번호 (issue_id 아닌 number 컬럼이다.)
    @Query('projectId') projectId: string // 프로젝트 번호 (project_id)
  ): Promise<CommentDto[]> {
    this.logger.log(`[IssuesController] Received request for comments of issue ${id} in project ${projectId}`); // 디버깅 로그 
    
    // projectId 검증
    if (!projectId) {
      throw new BadRequestException('Project ID is required');
    }

    try {
      const comments = await this.issuesService.getComments(+id, +projectId);
      return comments;
    } catch (error) {
      this.logger.error(`[IssuesController] Error fetching comments for issue ${id} in project ${projectId}: ${error.message}`, error.stack); // 디버깅 로그 추가
      throw new InternalServerErrorException('Failed to fetch comments');
    }
  }

  @Get(':id/children')
  async getChildIssues(@Param('id') id: string) {
    return this.issuesService.getChildIssues(+id);
  }

  @Put(':projectId/:issueId')
  async updateIssue(
    @Param('projectId') projectId: string,
    @Param('issueId') issueId: string,
    @Body() updateIssueDto: any
  ) {
    try {
      const result = await this.issuesService.update(+projectId, +issueId, updateIssueDto);
      return { message: 'Issue updated successfully', result };
    } catch (error) {
      this.logger.error(`Error updating issue: ${error.message}`, error.stack);
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException('Failed to update issue');
    }
  }

  @Post(':projectId/:issueNumber/comments')
  async addComment(
    @Param('projectId') projectId: string,
    @Param('issueNumber') issueNumber: string,
    @Body() addCommentDto: { user_id: number, contents: string, parent_comment_id: number | null }
  ) {
    this.logger.log('==== addComment 함수 시작 ====');
    this.logger.log(`요청 받은 URL: /issues/${projectId}/${issueNumber}/comments`);
    this.logger.log('요청 본문:', JSON.stringify(addCommentDto, null, 2));
    this.logger.log(`projectId: ${projectId}`);
    this.logger.log(`issueNumber: ${issueNumber}`);
    this.logger.log(`userId: ${addCommentDto.user_id}`);
    this.logger.log(`contents: ${addCommentDto.contents}`);
    this.logger.log(`parent_comment_id: ${addCommentDto.parent_comment_id}`);

    try {
      const result = await this.issuesService.addComment(
        +projectId, 
        +issueNumber, 
        addCommentDto.user_id, 
        addCommentDto.contents,
        addCommentDto.parent_comment_id
      );
      this.logger.log('댓글 추가 결과:', JSON.stringify(result, null, 2));
      this.logger.log('==== addComment 함수 종료 ====');
      return { message: 'Comment added successfully', result };
    } catch (error) {
      this.logger.error('==== addComment 함수 에러 ====');
      this.logger.error(`Error adding comment: ${error.message}`);
      this.logger.error(error.stack);
      throw new InternalServerErrorException('Failed to add comment');
    }
  }

  @Put(':projectId/:issueNumber/comments/:commentId')
  async updateComment(
    @Param('projectId') projectId: string,
    @Param('issueNumber') issueNumber: string,
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: { contents: string, user_id: number }
  ) {
    this.logger.log(`Updating comment ${commentId} for issue ${issueNumber} in project ${projectId}`);
    try {
      const result = await this.issuesService.updateComment(
        +projectId,
        +issueNumber,
        +commentId,
        updateCommentDto.user_id,
        updateCommentDto.contents
      );
      return { message: 'Comment updated successfully', result };
    } catch (error) {
      this.logger.error(`Error updating comment: ${error.message}`);
      throw new InternalServerErrorException('Failed to update comment');
    }
  }

  @Delete(':projectId/:issueNumber/comments/:commentId')
  async deleteComment(
    @Param('projectId') projectId: string,
    @Param('issueNumber') issueNumber: string,
    @Param('commentId') commentId: string,
    @Query('user_id') userId: string
  ) {
    this.logger.log(`Deleting comment ${commentId} for issue ${issueNumber} in project ${projectId}`);
    try {
      await this.issuesService.deleteComment(+projectId, +issueNumber, +commentId, +userId);
      return { message: 'Comment deleted successfully' };
    } catch (error) {
      this.logger.error(`Error deleting comment: ${error.message}`);
      throw new InternalServerErrorException('Failed to delete comment');
    }
  }
}
