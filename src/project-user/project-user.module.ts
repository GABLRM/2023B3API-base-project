import { Module, forwardRef } from '@nestjs/common';
import { ProjectUserService } from './project-user.service';
import { ProjectUserController } from './project-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectUser } from './entities/project-user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectUser]),
    forwardRef(() => UserModule)],
  controllers: [ProjectUserController],
  providers: [ProjectUserService, JwtService],
  exports: [ProjectUserService]
})
export class ProjectUserModule {}
