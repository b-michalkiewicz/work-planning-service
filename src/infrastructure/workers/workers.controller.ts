import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from "@nestjs/common";
import { Id } from "src/domain/value-objects/id";
import { CreateWorkerDto } from "./dto/create-worker.dto";
import { UpdateWorkerDto } from "./dto/update-worker.dto";
import { WorkerDto } from "./dto/worker.dto";
import { ShiftDateDto, WorkingShiftDto } from "./dto/working-shift.dto";
import { WorkersService } from "./workers.service";

@Controller("workers")
export class WorkersController {
    constructor(private readonly workersService: WorkersService) {}

    @Post()
    createWorker(@Body() createDto: CreateWorkerDto): Promise<WorkerDto> {
        return this.workersService.createWorker(createDto);
    }

    @Get("/:workerId")
    readWorker(@Param("workerId") workerId: Id): Promise<WorkerDto> {
        return this.workersService.findWorker(workerId);
    }

    @Patch("/:workerId")
    updateWorker(@Param("workerId") workerId: Id, @Body() updateDto: UpdateWorkerDto): Promise<WorkerDto> {
        return this.workersService.updateWorker(workerId, updateDto);
    }

    @Delete("/:workerId")
    @HttpCode(204)
    deleteWorker(@Param("workerId") workerId: Id): Promise<void> {
        return this.workersService.removeWorker(workerId);
    }

    @Post("/:workerId/shifts")
    createShift(@Param("workerId") workerId: Id, @Body() workingShiftDto: WorkingShiftDto): Promise<WorkerDto> {
        return this.workersService.assignWorkingShift(workerId, workingShiftDto);
    }

    @Delete("/:workerId/shifts")
    deleteShift(@Param("workerId") workerId: Id, @Body() shiftDateDto: ShiftDateDto): Promise<WorkerDto> {
        return this.workersService.unassignWorkingShift(workerId, shiftDateDto);
    }

    @Patch("/:workerId/shifts")
    updateShift(@Param("workerId") workerId: Id, @Body() workingShiftDto: WorkingShiftDto): Promise<WorkerDto> {
        return this.workersService.changeWorkingShift(workerId, workingShiftDto);
    }
}
