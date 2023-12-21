import { IsNotEmpty, MinLength } from "class-validator";

export class CreateProjectDto {
    @IsNotEmpty()
    @MinLength(3)
    public name!: string;

    @IsNotEmpty()
    public referringEmployeeId!: string;
}
