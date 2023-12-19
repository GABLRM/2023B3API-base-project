import { Controller, Post, Body, ValidationPipe, UsePipes, Get, Param, UseGuards, Req, ParseUUIDPipe, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '../auth/jwt-auth.guard';
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
  getMyProfile(@Req() req) {
    return this.userService.findEmployee(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Get(":id")
  findOneUuid(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST})) id: string) {
    return this.userService.findEmployee(id)
  }

  @UseGuards(AuthGuard)
  @Get()
  findAllUsers() {
    return this.userService.findAll()
  }
}
