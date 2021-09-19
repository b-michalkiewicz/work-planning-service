import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { WorkerProps } from "src/domain/entities/worker";
import { WorkingShiftDto } from "./working-shift.dto";

export class CreateWorkerDto implements Omit<WorkerProps, "id" | "workingShifts"> {
    @IsNotEmpty()
    @IsString()
    firstName!: string;
    @IsNotEmpty()
    @IsString()
    lastName!: string;
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => WorkingShiftDto)
    workingShifts!: WorkingShiftDto[];
}
