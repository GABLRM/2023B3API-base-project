import { IsNotEmpty } from "class-validator";

export class CreateProjectUserDto {
    @IsNotEmpty()
    public startDate!: Date;

    @IsNotEmpty()
    public endDate!: Date;

    @IsNotEmpty()
    public userId!: string;

    @IsNotEmpty()
    public projectId!: string;
}
