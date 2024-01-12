import { Body, Controller, Get, Param, Post, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { EventService } from "./event.service";
import { AuthGuard } from "../auth/jwt-auth.guard";
import { CreateEventDto } from "./dto/create-event.dto";
import { UserService } from "../user/user.service";
import { EventStatus, EventType } from "./entities/event.entity";
import { UserRole } from "../user/entities/user.entity";


@Controller('events')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly userService: UserService,
  ) { }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Req() req, @Body() event: CreateEventDto) {
    const currentUser = await this.userService.findEmployee(req.user.sub);
    const currentUserEvent = await this.eventService.findUserEvents(currentUser.id);
    let remoteWork = 0;
    for (const eventUser of currentUserEvent) {
      if (eventUser.eventType == EventType.REMOTEWORK) {
        remoteWork++;
        if (remoteWork == 2) {
          throw new UnauthorizedException("You have already two remotes works this week !");
        }
        eventUser.eventStatus = EventStatus.ACCEPTED;
      }
      if (new Date(eventUser.date).getTime() == new Date(event.date).getTime()) {
        throw new UnauthorizedException("You have already an event this day");
      }
    }
    return await this.eventService.create(event, currentUser.id);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.eventService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Post(':id/validate')
  async validate(@Req() req, @Body() body, @Param('id') id: string) {
    const currentUser = await this.userService.findEmployee(req.user.sub);
    const event = await this.eventService.findOne(id);
    if (currentUser.role === UserRole.EMPLOYEE || event.eventStatus !== EventStatus.PENDING) {
      throw new UnauthorizedException("you are not allowed");
    }
    if (currentUser.role === UserRole.PROJECTMANAGER) {
    }
    return this.eventService.validate(event.id);
  }

  @UseGuards(AuthGuard)
  @Post(':id/decline')
  async decline(@Req() req, @Body() body, @Param('id') id: string) {
    const currentUser = await this.userService.findEmployee(req.user.sub);
    const event = await this.eventService.findOne(id);
    if (currentUser.role === UserRole.EMPLOYEE || event.eventStatus !== EventStatus.PENDING) {
      throw new UnauthorizedException("you are not allowed");
    }
    return this.eventService.decline(event.id);
  }
}
