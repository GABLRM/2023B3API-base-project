import { Controller, Get, UseGuards, Req, Param, Post, HttpException, HttpStatus, Body } from "@nestjs/common";
import { ProjectUserService } from './project-user.service';
import { AuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from '../user/user.service';
import { CreateProjectUserDto } from "./dto/create-project-user.dto";
import { ProjectsService } from "../projects/projects.service";

@Controller('project-users')
export class ProjectUserController {
  constructor(
    private readonly projectUserService: ProjectUserService,
    private readonly userService: UserService,
    private readonly projectsService : ProjectsService,
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  async getProjectUser(@Req() req) {
    const currentUser = await this.userService.findOne(req.user.sub);
    if (currentUser.role !== 'Employee') {
      return this.projectUserService.findAll();
    } else {
      return this.projectUserService.findOne(req.user.sub);
    }
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findSpecificProject(@Req() req, @Param('id') id: string) {
    const currentUser = await this.userService.findOne(req.user.sub);
    if (currentUser.role !== 'Employee') {
      return this.projectUserService.findOne(id);
    } else {
      return this.projectUserService.findOne(req.user.sub);
    }
  }

  @UseGuards(AuthGuard)
  @Post()
  async createProjetUser(@Req() req, @Body() createProjectUserDto : CreateProjectUserDto ) {
    const currentUser = await this.userService.findOne(req.user.sub);
    const userProject = await this.userService.findOne(createProjectUserDto.userId);
    const project = await this.projectsService.findProjectById(createProjectUserDto.projectId);
    if (currentUser.role == 'Employee') {
      throw new HttpException('Employee can create Project', HttpStatus.UNAUTHORIZED);
    }
    if (userProject == null || project == null) {
       throw new HttpException('The user or the project not exist', HttpStatus.NOT_FOUND);
    }
  }
}
