import { BadRequestException, Injectable } from "@nestjs/common";
import { Worker } from "src/domain/entities/worker";
import { handleDomainError } from "src/domain/error-handler";
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
        const worker = handleDomainError(
            await this.domainService.createWorker({
                ...updateDto,
                workingShifts: this.getWorkingShifts(updateDto.workingShifts),
            }),
        );

        return convertWorkerToDto(worker);
    }

    private getWorkingShifts(workingShiftsDto: WorkingShiftDto[]) {
        const datesWithKinds = workingShiftsDto.map(({ date, kind }) => ({ date: ShiftDate.create(date), kind }));

        const errors = datesWithKinds.map((wsd) => wsd.date).filter((d): d is Error => isError(d));
        if (errors.length > 0) throw new BadRequestException(errors.map((e) => e.message).join(" "));

        return datesWithKinds.map(({ date, kind }) => new WorkingShift(date as ShiftDate, kind));
    }

    async findWorker(workerId: Id): Promise<WorkerDto> {
        const worker = handleDomainError(await this.domainService.findWorker(workerId));
        return convertWorkerToDto(worker);
    }

    async updateWorker(workerId: Id, updateDto: UpdateWorkerDto): Promise<WorkerDto> {
        const worker = handleDomainError(await this.domainService.updateWorker(workerId, updateDto));
        return convertWorkerToDto(worker);
    }

    async removeWorker(workerId: Id): Promise<void> {
        handleDomainError(await this.domainService.removeWorker(workerId));
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
        const shiftDate = handleDomainError(ShiftDate.create(shiftDateDto));
        return convertWorkerToDto(handleDomainError(await workerProvider(shiftDate)));
    }
}
