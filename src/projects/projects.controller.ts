import { Controller, Post, Body, Req, UseGuards, UnauthorizedException, Param, HttpException, HttpStatus, Get } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { AuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from '../user/user.service';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly userService: UserService,
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
      return null;
    } else {
      return this.projectsService.findAll();
    }
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOneProject(@Req() req, @Param('id') id: string) {
    const currentUser = await this.userService.findOne(req.user.sub);
    const desiredProject = await this.projectsService.findProjectById(id);

    console.log('2 - ' + JSON.stringify(desiredProject));
    if (desiredProject.length === 0) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }

    if (currentUser.id) {
      
    }
  }
}
