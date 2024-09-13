import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
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
}