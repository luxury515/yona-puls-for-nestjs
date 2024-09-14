import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Controller('projects') // 이 부분이 '/projects' 경로를 처리합니다
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  async getAllProjects() {
    return this.projectsService.getAllProjects();
  }

  @Get(':id/issues')
  async getProjectIssues(
    @Param('id') id: string,
    @Query('page') page?: number,  // 값이 없어도 전체 조회 가능
    @Query('pageSize') pageSize?: number,  // 값이 없어도 전체 조회 가능
    @Query('state') state?: 'open' | 'closed'  // 값이 없어도 전체 조회 가능
  ) {
    return this.projectsService.getProjectIssues(
      +id, 
      page ?? 1,  // 기본값 1
      pageSize ?? 10,  // 기본값 10
      state ?? 'open'  // 기본값 'open'
    );
  }

  // 현재 프로젝트 참여중인 member 목록
  @Get(':id/members')
  async getProjectMembers(@Param('id') id: string) {
    return this.projectsService.getProjectMembers(+id);
  }

  // 전체 사용자에서 검색
  // @Get('users/search')
  // async searchUsers(@Query('query') query: string) {
  //   return this.projectsService.searchUsers(query);
  // }

  // 현재 프로젝트에 사용자 추가
  @Post(':id/members')
  async addProjectMember(
    @Param('id') id: string,
    @Body('userId') userId: number
  ) {
    return this.projectsService.addProjectMember(+id, userId);
  }

  // 현재 프로젝트에서 사용자 탈퇴
  @Delete(':id/members/:userId')
  async removeProjectMember(
    @Param('id') id: string,
    @Param('userId') userId: string
  ) {
    return this.projectsService.removeProjectMember(+id, +userId);
  }

  @Get(':id/users/search')
  async searchUsers(
    @Param('id') id: string,
    @Query('query') query: string
  ) {
    return this.projectsService.searchUsers(query, +id);
  }
}