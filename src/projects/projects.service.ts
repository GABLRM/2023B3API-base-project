import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';

@Injectable()
export class ProjectsService {
  
  constructor(
      @InjectRepository(Project)
      private projetcsRepository: Repository<Project>,
      private userService: UserService
    ) { }

  async create(createProjectDto: CreateProjectDto) {
    const newProject = this.projetcsRepository.create(createProjectDto);
    const project = await this.projetcsRepository.save(newProject);
    project["referringEmployee"] = await this.userService.findEmployee(createProjectDto.referringEmployeeId);
    return project;
  }

  findAll() {
    return this.projetcsRepository.find();
  }

    findReferringEmployee(id: string) {
    return this.projetcsRepository.find({ where: { id: id } });
  }

  findProjectById(id: string) {
    return this.projetcsRepository.find({ where: { id: id } });
  }

}
