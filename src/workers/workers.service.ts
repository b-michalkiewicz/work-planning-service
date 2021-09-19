import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Worker } from "src/domain/entities/worker";
import { WorkerService } from "src/domain/services/worker-service";
import { Id } from "src/domain/value-objects/id";
import { isError } from "src/domain/value-objects/result";
import { ShiftDate } from "src/domain/value-objects/shift-date";
import { WorkingShift } from "src/domain/value-objects/working-shift";
import { CreateWorkerDto } from "./dto/create-worker.dto";
import { convertWorkerToDto, WorkerDto } from "./dto/worker.dto";
import { DomainWorkerServiceProvider } from "./workers.di";

@Injectable()
export class WorkersService {
    private readonly domainService: WorkerService;

    constructor(domainServiceProvider: DomainWorkerServiceProvider) {
        this.domainService = domainServiceProvider.provideDomainWorkerService();
    }

    async createWorker(dto: CreateWorkerDto): Promise<WorkerDto> {
        const worker = await this.domainService.createWorker({
            ...dto,
            workingShifts: this.getWorkingShifts(dto),
        });
        if (isError(worker)) throw new BadRequestException(worker.message);

        return convertWorkerToDto(worker);
    }

    private getWorkingShifts(dto: CreateWorkerDto) {
        const datesWithKinds = dto.workingShifts.map(({ date, kind }) => ({ date: ShiftDate.create(date), kind }));

        const errors = datesWithKinds.map((wsd) => wsd.date).filter((d): d is Error => isError(d));
        if (errors.length > 0) throw new BadRequestException(errors.map((e) => e.message).join(" "));

        return datesWithKinds.map(({ date, kind }) => new WorkingShift(date as ShiftDate, kind));
    }

    async findWorker(workerId: Id): Promise<WorkerDto> {
        const worker = await this.domainService.findWorker(workerId);
        if (isError(worker)) throw new NotFoundException(worker.message);

        return convertWorkerToDto(worker);
    }
}
