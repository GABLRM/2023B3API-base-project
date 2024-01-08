import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum EventStatus {
    PENDING = 'Pending',
    ACCEPTED = 'Accepted',
    DECLINED = 'DECLINED'
}

export enum EventType {
    REMOTEWORK = 'RemoteWork',
    PAIDLEAVE = 'PaidLeave'
}

@Entity()
export class Event {
    @PrimaryGeneratedColumn('uuid')
    public id!: string;

    @Column()
    public date!: Date;

    @Column({default: EventStatus.PENDING})
    public eventStatus?: EventStatus;

    @Column()
    public eventDescription?: string;

    @Column()
    public eventType!: EventType;

    @Column()
    public userId!: string;
}
