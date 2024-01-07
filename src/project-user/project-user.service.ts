import { Injectable } from "@nestjs/common";
import { CreateProjectUserDto } from "./dto/create-project-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ProjectUser } from "./entities/project-user.entity";
import { Repository } from "typeorm";
import { UserService } from "../user/user.service";
import { ProjectsService } from "../projects/projects.service";

@Injectable()
export class ProjectUserService {

  constructor(
    @InjectRepository(ProjectUser)
    private projectUserRepository: Repository<ProjectUser>,
    private userService : UserService,
    private projectService: ProjectsService,

  ) { }

  async create(createProjectUserDto: CreateProjectUserDto) {
    const newUserProject = this.projectUserRepository.create(createProjectUserDto);
    const userProject = await this.projectUserRepository.save(newUserProject);
    userProject['user'] = await this.userService.findEmployee(createProjectUserDto.userId);
    userProject['project'] = await this.findProjectWithReferringEmployeeInfo(createProjectUserDto.projectId);
    return userProject;
  }
  async findProjectWithReferringEmployeeInfo(projetId: string) {
    const project =  await this.projectService.findProjectById(projetId);
    project['referringEmployee'] = await this.userService.findEmployee(project.referringEmployeeId);
    return project
  }


  findAll() {
    return this.projectUserRepository.find();
  }

  findOne(id: string) {
    return this.projectUserRepository.findOne({ where: { id: id } });
  }

  findEmployeeProject(id, userId) {
    return this.projectUserRepository.find( { where : { id: id, userId : userId } });
  }

  findEmployeeInProject(userId) {
    return this.projectUserRepository.find({ where : { userId: userId } });
  }

  findUserProjectWithProjectId(projectId) {
    return this.projectUserRepository.find({ where : { projectId: projectId}})
  }

  userInProject(id: string) {
    return this.projectUserRepository.find({ where: { userId: id } });
  }
}
