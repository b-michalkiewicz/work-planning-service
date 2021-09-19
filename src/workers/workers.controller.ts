import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { Id } from "src/domain/value-objects/id";
import { Worker } from "../domain/entities/worker";
import { CreateWorkerDto } from "./dto/create-worker.dto";
import { WorkersService } from "./workers.service";

@Controller("workers")
export class WorkersController {
    constructor(private readonly workersService: WorkersService) {}

    @Post()
    createWorker(@Body() dto: CreateWorkerDto): Promise<Worker> {
        return this.workersService.createWorker({ ...dto, workingShifts: [] });
    }

    @Get("/:workerId")
    getWorker(@Param("workerId") workerId: Id): Promise<Worker> {
        return this.workersService.findWorker(workerId);
    }
}
