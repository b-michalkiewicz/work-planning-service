import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, ValidateNested } from "class-validator";
import { WorkerProps } from "src/domain/entities/worker";
import { WorkingShiftDto } from "./working-shift.dto";

export class CreateWorkerDto implements Omit<WorkerProps, "id" | "workingShifts"> {
    @IsNotEmpty()
    firstName!: string;
    @IsNotEmpty()
    lastName!: string;
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => WorkingShiftDto)
    workingShifts!: WorkingShiftDto[];
}
