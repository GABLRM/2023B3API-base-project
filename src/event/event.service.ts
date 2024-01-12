import { Injectable } from "@nestjs/common";
import { CreateEventDto } from "./dto/create-event.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Event, EventStatus } from "./entities/event.entity";
import { Repository } from "typeorm";

@Injectable()
export class EventService {

  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>
  ) {
  }
  async create(createEventDto: CreateEventDto, userId: string) {
    const newEvent = this.eventRepository.create(createEventDto);
    newEvent.userId = userId;
    return this.eventRepository.save(newEvent);
  }

  async findUserEvents(userId: string) {
    return await this.eventRepository.find({ where: { userId: userId } });
  }

  findAll() {
    return this.eventRepository.find();
  }

  async findOne(id: string) {
    return await this.eventRepository.findOne({ where: { id: id } });
  }

  async validate(eventId: string) {
    const eventToValidate = await this.findOne(eventId);
    eventToValidate.eventStatus = EventStatus.ACCEPTED;
    return eventToValidate;
  }

  async decline(eventId: string) {
    const eventToValidate = await this.findOne(eventId);
    eventToValidate.eventStatus = EventStatus.DECLINED;
    return eventToValidate;
  }

}
