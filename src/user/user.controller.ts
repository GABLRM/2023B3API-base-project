import { Controller, Post, Body, ValidationPipe, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from '../auth/auth.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) { }

  @Post("auth/sign-up")
  @UsePipes(new ValidationPipe())
  SignUp(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post("auth/login")
  signIn(@Body('email') email : string, @Body('password') password : string) {
    return this.authService.signIn(email, password);
  }
}
