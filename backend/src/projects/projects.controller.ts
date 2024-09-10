import { Controller, Post, Body, Get, Param } from '@nestjs/common';
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
  async getProjectIssues(@Param('id') id: string) {
    return this.projectsService.getProjectIssues(parseInt(id));
  }
}