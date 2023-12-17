import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";

@Entity()
export class Project {

    @PrimaryGeneratedColumn('uuid')
    public id!: string;

    @Column( {unique: true} )
    public name!: string;

    @Column()
    public referringEmployeeId!: string;
}
