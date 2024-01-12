import { Body, ConflictException, Controller, Get, NotFoundException, Param, Post, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { ProjectUserService } from "./project-user.service";
import { AuthGuard } from "../auth/jwt-auth.guard";
import { UserService } from "../user/user.service";
import { CreateProjectUserDto } from "./dto/create-project-user.dto";
import { ProjectsService } from "../projects/projects.service";

@Controller('project-users')
export class ProjectUserController {
  constructor(
    private readonly projectUserService: ProjectUserService,
    private readonly userService: UserService,
    private readonly projectsService: ProjectsService,
  ) { }

  @UseGuards(AuthGuard)
  @Get()
  async getProjectUser(@Req() req) {
    const currentUser = await this.userService.findOne(req.user.sub);
    if (currentUser.role !== 'Employee') {
      return this.projectUserService.findAll();
    } else {
      return this.projectUserService.userInProject(req.user.sub);
    }
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findSpecificProject(@Req() req, @Param('id') id: string) {
    const currentUser = await this.userService.findOne(req.user.sub);
    if (currentUser.role !== 'Employee') {
      return await this.projectUserService.findOne(id);
    } else {
      const employeeProject = await this.projectUserService.findEmployeeProject(id, currentUser.id);
      if (employeeProject.length == 0) {
        throw new UnauthorizedException("You don't have the authorization to access this project");
      } else {
        return employeeProject;
      }
    }
  }

  @UseGuards(AuthGuard)
  @Post()
  async createProjetUser(@Req() req, @Body() createProjectUser: CreateProjectUserDto) {
    const currentUser = await this.userService.findOne(req.user.sub);
    const userProject = await this.userService.findOne(createProjectUser.userId);
    const project = await this.projectsService.findProjectById(createProjectUser.projectId);
    const allProjectUser = await this.projectUserService.findEmployeeInProject(userProject.id);
    if (project === null) {
      throw new NotFoundException('The user or the project not exist');
    }
    for (const projectUser of allProjectUser) {
      if (!(createProjectUser.startDate < projectUser.startDate && createProjectUser.endDate < projectUser.startDate) || !(createProjectUser.startDate > projectUser.endDate && createProjectUser.endDate > projectUser.endDate)) {
        throw new ConflictException("You are already in a project in this date");
      }
    }
    if (currentUser.role !== 'Employee') {
      return this.projectUserService.create(createProjectUser);
    } else {
      throw new UnauthorizedException('Employee can create Project');
    }
  }
}
