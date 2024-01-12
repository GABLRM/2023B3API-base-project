import { IsEmail, IsEnum, IsNotEmpty, IsOptional, MinLength } from "class-validator";
import { UserRole } from "../entities/user.entity"

export class CreateUserDto {

    @IsNotEmpty()
    @MinLength(3)
    public username!: string;

    @IsNotEmpty()
    @IsEmail()
    public email!: string;

    @IsNotEmpty()
    @MinLength(8)
    public password!: string;

    @IsEnum(UserRole)
    @IsOptional()
    public role!: UserRole;
}
