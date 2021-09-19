import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Worker } from "src/domain/entities/worker";
import { WorkerService } from "src/domain/services/worker-service";
import { Id } from "src/domain/value-objects/id";
import { isError, Result } from "src/domain/value-objects/result";
import { ShiftDate } from "src/domain/value-objects/shift-date";
import { WorkingShift } from "src/domain/value-objects/working-shift";
import { CreateWorkerDto } from "./dto/create-worker.dto";
import { UpdateWorkerDto } from "./dto/update-worker.dto";
import { convertWorkerToDto, WorkerDto } from "./dto/worker.dto";
import { ShiftDateDto, WorkingShiftDto } from "./dto/working-shift.dto";
import { DomainWorkerServiceProvider } from "./workers.di";

@Injectable()
export class WorkersService {
    private readonly domainService: WorkerService;

    constructor(domainServiceProvider: DomainWorkerServiceProvider) {
        this.domainService = domainServiceProvider.provideDomainWorkerService();
    }

    async createWorker(updateDto: CreateWorkerDto): Promise<WorkerDto> {
        const worker = await this.domainService.createWorker({
            ...updateDto,
            workingShifts: this.getWorkingShifts(updateDto.workingShifts),
        });
        if (isError(worker)) throw new BadRequestException(worker.message);

        return convertWorkerToDto(worker);
    }

    private getWorkingShifts(workingShiftsDto: WorkingShiftDto[]) {
        const datesWithKinds = workingShiftsDto.map(({ date, kind }) => ({ date: ShiftDate.create(date), kind }));

        const errors = datesWithKinds.map((wsd) => wsd.date).filter((d): d is Error => isError(d));
        if (errors.length > 0) throw new BadRequestException(errors.map((e) => e.message).join(" "));

        return datesWithKinds.map(({ date, kind }) => new WorkingShift(date as ShiftDate, kind));
    }

    async findWorker(workerId: Id): Promise<WorkerDto> {
        const worker = await this.domainService.findWorker(workerId);
        if (isError(worker)) throw new NotFoundException(worker.message);

        return convertWorkerToDto(worker);
    }

    async updateWorker(workerId: Id, updateDto: UpdateWorkerDto): Promise<WorkerDto> {
        const worker = await this.domainService.updateWorker(workerId, updateDto);
        if (isError(worker)) throw new NotFoundException(worker.message);

        return convertWorkerToDto(worker);
    }

    async removeWorker(workerId: Id): Promise<void> {
        const result = await this.domainService.removeWorker(workerId);
        if (isError(result)) throw new NotFoundException(result.message);
    }

    async assignWorkingShift(workerId: Id, workingShiftDto: WorkingShiftDto): Promise<WorkerDto> {
        return this.validateDateAndMapWorker(workingShiftDto.date, (shiftDate) =>
            this.domainService.assignWorkingShift(workerId, new WorkingShift(shiftDate, workingShiftDto.kind)),
        );
    }

    async unassignWorkingShift(workerId: Id, shiftDateDto: ShiftDateDto): Promise<WorkerDto> {
        return this.validateDateAndMapWorker(shiftDateDto, (shiftDate) =>
            this.domainService.unassignWorkingShift(workerId, shiftDate),
        );
    }

    async changeWorkingShift(workerId: Id, workingShiftDto: WorkingShiftDto): Promise<WorkerDto> {
        return this.validateDateAndMapWorker(workingShiftDto.date, (shiftDate) =>
            this.domainService.changeWorkingShift(workerId, shiftDate, workingShiftDto.kind),
        );
    }

    async validateDateAndMapWorker(
        shiftDateDto: ShiftDateDto,
        workerProvider: (_: ShiftDate) => Promise<Result<Worker>>,
    ): Promise<WorkerDto> {
        const shiftDate = ShiftDate.create(shiftDateDto);
        if (isError(shiftDate)) throw new BadRequestException(shiftDate.message);

        const worker = await workerProvider(shiftDate);
        if (isError(worker)) throw new NotFoundException(worker.message);

        return convertWorkerToDto(worker);
    }
}
