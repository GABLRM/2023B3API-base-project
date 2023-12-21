import { isNotEmpty, IsNotEmpty, isNotIn } from "class-validator";
import { isValidDate } from "rxjs/internal/util/isDate";

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
