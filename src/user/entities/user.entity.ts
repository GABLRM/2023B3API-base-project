import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

export enum UserRole {
  EMPLOYEE = 'Employee',
  ADMIN = 'Admin',
  PROJECTMANAGER = 'ProjectManager'
}

@Entity()
export class User {

  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ unique: true })
  public username!: string;

  @Column({ unique: true })
  public email!: string;

  @Column({ select: false })
  public password!: string;

  @Column({ default: UserRole.EMPLOYEE })
  public role!: UserRole;
}