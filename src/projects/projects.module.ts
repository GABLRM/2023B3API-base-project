import { Module, forwardRef } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project } from './entities/project.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { JwtService } from '@nestjs/jwt';
import { ProjectUserModule } from "../project-user/project-user.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    forwardRef(() => UserModule),
    ProjectUserModule],
  controllers: [ProjectsController],
  providers: [ProjectsService, JwtService],
  exports: [ProjectsService]
})
export class ProjectsModule {}
