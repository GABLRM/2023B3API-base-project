import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ProjectUserService } from './project-user.service';
import { AuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from '../user/user.service';

@Controller('project-users')
export class ProjectUserController {
  constructor(
    private readonly projectUserService: ProjectUserService,
    private readonly userService: UserService
  ) { }

  @UseGuards(AuthGuard)
  @Get()
  async getProjectUser(@Req() req) {
    const currentUser = await this.userService.findOne(req.user.sub)
    if (currentUser.role !== "Employee") {
      return this.projectUserService.findAll()
    } else {
      return this.projectUserService.findEmployeeProject(req.user.sub);
    }
  }
}
