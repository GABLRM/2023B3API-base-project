import { Controller, Post, Body, Req, UseGuards, UnauthorizedException, Param, HttpException, HttpStatus, Get } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { AuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from '../user/user.service';
import { ProjectUserService } from "../project-user/project-user.service";

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly userService: UserService,
    private readonly projectUserService : ProjectUserService,
  ) { }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Req() req, @Body() createProjectDto: CreateProjectDto) {
    const currentUser = await this.userService.findOne(req.user.sub);
    const referringEmployee = await this.userService.findOne(createProjectDto.referringEmployeeId,);
    if (referringEmployee.role !== 'Employee') {
      if (currentUser.role === 'Admin') {
        return this.projectsService.create(createProjectDto);
      } else {
        throw new UnauthorizedException();
      }
    } else {
      throw new UnauthorizedException();
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  async findProject(@Req() req) {
    const currentUser = await this.userService.findOne(req.user.sub);
    if (currentUser.role === 'Employee') {
      return await this.projectsService.findProjectWithUserInfo(currentUser.id)
    } else {
      return this.projectsService.findAll();
    }
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOneProject(@Req() req, @Param('id') id: string) {
    const currentUser = await this.userService.findOne(req.user.sub);
    const desiredProject = await this.projectsService.findProjectById(id);
    if (desiredProject === null) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }
    if (currentUser.role !== 'Employee') {
      return desiredProject
    } else {
      return await this.projectUserService.findEmployeeProject(id, currentUser.id);
    }
  }
}
