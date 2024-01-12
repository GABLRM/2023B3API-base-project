import { Body, Controller, ForbiddenException, Get, NotFoundException, Param, Post, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { AuthGuard } from "../auth/jwt-auth.guard";
import { UserService } from "../user/user.service";
import { ProjectUserService } from "../project-user/project-user.service";

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly userService: UserService,
    private readonly projectUserService: ProjectUserService,
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
    if (currentUser.role !== 'Employee') {
      const allProject = await this.projectsService.findAll();
      for (const project of allProject) {
        project["referringEmployee"] = await this.userService.findEmployee(project.referringEmployeeId);
      }
      return allProject;
    } else {
      const employeeProject = [];
      const projectUser = await this.projectUserService.findEmployeeInProject(currentUser.id);
      for (const items of projectUser) {
        const project = await this.projectsService.findProjectById(items.projectId);
        project["referringEmployee"] = await this.userService.findEmployee(project.referringEmployeeId);
        employeeProject.push(project);
      }
      return employeeProject;
    }
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOneProject(@Req() req, @Param('id') id: string) {
    const currentUser = await this.userService.findOne(req.user.sub);
    const desiredProject = await this.projectsService.findProjectById(id);
    if (desiredProject === null) {
      throw new NotFoundException('Project not found');
    }
    if (currentUser.role !== 'Employee') {
      return desiredProject;
    } else {
      const userProject = await this.projectUserService.findUserProjectWithProjectId(desiredProject.id);
      if (userProject.length === 0) {
        throw new ForbiddenException("Forbidden");
      } else {
        return desiredProject;
      }
    }
  }
}
