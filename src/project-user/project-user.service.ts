import { Injectable } from '@nestjs/common';
import { CreateProjectUserDto } from './dto/create-project-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectUser } from './entities/project-user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectUserService {

  constructor(
    @InjectRepository(ProjectUser)
    private projectUserRepository: Repository<ProjectUser>,

  ) { }

  create(createProjectUserDto: CreateProjectUserDto) {
    return 'This action adds a new projectUser';
  }

  findAll() {
    return this.projectUserRepository.find();
  }

  findOne(id: string) {
    return this.projectUserRepository.find({ where: { id: id } });
  }

  userInProject(id: string) {
    return this.projectUserRepository.find({ where: { userId: id } })
  }
}
