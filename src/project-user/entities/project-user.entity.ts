import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ProjectUser {

    @PrimaryGeneratedColumn('uuid')
    public id!: string;

    @Column()
    public startDate!: Date;

    @Column()
    public endDate!: Date;

    @Column()
    public projectId!: string;

    @Column()
    public userId!: string;
}
