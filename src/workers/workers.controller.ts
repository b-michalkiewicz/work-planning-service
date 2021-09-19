import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { Id } from "src/domain/value-objects/id";
import { CreateWorkerDto } from "./dto/create-worker.dto";
import { WorkerDto } from "./dto/worker.dto";
import { WorkersService } from "./workers.service";

@Controller("workers")
export class WorkersController {
    constructor(private readonly workersService: WorkersService) {}

    @Post()
    createWorker(@Body() dto: CreateWorkerDto): Promise<WorkerDto> {
        return this.workersService.createWorker(dto);
    }

    @Get("/:workerId")
    getWorker(@Param("workerId") workerId: Id): Promise<WorkerDto> {
        return this.workersService.findWorker(workerId);
    }
}
