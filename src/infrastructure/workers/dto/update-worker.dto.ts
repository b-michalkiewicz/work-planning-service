import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { WorkerUpdate } from "src/domain/entities/worker";

export class UpdateWorkerDto implements WorkerUpdate {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    firstName?: string;
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    lastName?: string;
}
