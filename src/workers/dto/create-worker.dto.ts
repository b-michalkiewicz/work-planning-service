import { IsNotEmpty } from "class-validator";
import { WorkerProps } from "src/domain/entities/worker";
import { WorkingShifts } from "src/domain/value-objects/working-shifts";

export class CreateWorkerDto implements WorkerProps {
    @IsNotEmpty()
    firstName!: string;
    @IsNotEmpty()
    lastName!: string;
    workingShifts: WorkingShifts = [];
}
