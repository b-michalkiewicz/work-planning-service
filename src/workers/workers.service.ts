import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Worker } from "src/domain/entities/worker";
import { WorkerService } from "src/domain/services/worker-service";
import { Id } from "src/domain/value-objects/id";
import { isError } from "src/domain/value-objects/result";
import { CreateWorkerDto } from "./dto/create-worker.dto";
import { DomainWorkerServiceProvider } from "./workers.di";

@Injectable()
export class WorkersService {
    private readonly domainService: WorkerService;

    constructor(domainServiceProvider: DomainWorkerServiceProvider) {
        this.domainService = domainServiceProvider.provideDomainWorkerService();
    }

    async createWorker(dto: CreateWorkerDto): Promise<Worker> {
        const worker = await this.domainService.createWorker(dto);
        if (isError(worker)) throw new BadRequestException(worker.message);

        return worker;
    }

    async findWorker(workerId: Id): Promise<Worker> {
        const worker = await this.domainService.findWorker(workerId);
        if (isError(worker)) throw new NotFoundException(worker.message);

        return worker;
    }
}
