import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Event } from "./entities/event.entity";
import { JwtService } from "@nestjs/jwt";
import { UserModule } from "../user/user.module";

@Module({
  imports: [TypeOrmModule.forFeature([Event]),
    UserModule],
  controllers: [EventController],
  providers: [EventService, JwtService],
})
export class EventModule { }
