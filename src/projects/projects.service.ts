import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProjectsService {
  
  constructor(
      @InjectRepository(Project)
      private projetcsRepository: Repository<Project>,
    ) { }

  create(createProjectDto: CreateProjectDto) {
    const newProject = this.projetcsRepository.create(createProjectDto);
    return this.projetcsRepository.save(newProject);
  }

  findAll() {
    return this.projetcsRepository.find();
  }

    findAllByReferringEmployee(id: string) {
    return this.projetcsRepository.find({ where: { id: id } });
  }
}
