import { Controller, Get, Post, Body, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { AuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from '../user/user.service';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly userService: UserService
  ) { }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Req() req, @Body() createProjectDto: CreateProjectDto) {
    const currentUser = await this.userService.findOne(req.user.sub);
    const referringEmployee = await this.userService.findOne(createProjectDto.referringEmployeeId);
    if (referringEmployee.role != 'Employee') {
      if (currentUser.role == 'Admin') {
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
  findAll(@Req() req) {
    const currentUser = req.user;
    console.log("1 - ", currentUser) 
    if (currentUser.role === 'Admin' || currentUser.role === 'ProjectManager') {
      return this.projectsService.findAll();
    } else {
      return this.projectsService.findAllByReferringEmployee(currentUser.id);
    }
  }
}
