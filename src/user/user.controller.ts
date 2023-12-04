import { Controller, Post, Body, ValidationPipe, UsePipes, Get, Param, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '../auth/jwt-auth.guard';
import { User } from './entities/user.entity';
@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) { }

  @Post("auth/sign-up")
  @UsePipes(new ValidationPipe())
  SignUp(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post("auth/login")
  signIn(@Body('email') email: string, @Body('password') password: string) {
    return this.authService.signIn(email, password);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getMyProfile(@Req() req) {
    const me = await this.userService.findOne(req.user.sub);
    return me;
  }

  @UseGuards(AuthGuard)
  @Get(":id")
  findOneId(@Param('id') id: string) {
    return this.userService.findOne(id)
  }

  @UseGuards(AuthGuard)
  @Get()
  findAllUsers() {
    return this.userService.findAll()
  }
}
