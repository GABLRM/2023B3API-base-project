import { Module, forwardRef } from '@nestjs/common';
import { ProjectUserService } from './project-user.service';
import { ProjectUserController } from './project-user.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [forwardRef(() => UserModule)],
  controllers: [ProjectUserController],
  providers: [ProjectUserService],
})
export class ProjectUserModule {}
