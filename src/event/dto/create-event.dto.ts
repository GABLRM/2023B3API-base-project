import { IsEnum, IsNotEmpty } from "class-validator";
import { EventType } from "../entities/event.entity";

export class CreateEventDto {
    @IsNotEmpty()
    date!: Date;

    @IsNotEmpty()
    eventDescription?: string;

    @IsEnum(EventType)
    @IsNotEmpty()
    eventType!: EventType;
}
