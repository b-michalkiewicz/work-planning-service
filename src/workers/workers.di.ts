import { Injectable, Inject } from "@nestjs/common";
import { WorkerRepository } from "src/domain/repositories/worker-repository";
import { WorkerService } from "src/domain/services/worker-service";

export const WorkersRepository = Symbol.for("WorkersRepository");

@Injectable()
export class DomainWorkerServiceProvider {
    private static service: WorkerService;

    constructor(@Inject(WorkersRepository) private readonly workerRepository: WorkerRepository) {}

    provideDomainWorkerService(): WorkerService {
        if (!DomainWorkerServiceProvider.service) {
            DomainWorkerServiceProvider.service = new WorkerService(this.workerRepository);
        }
        return DomainWorkerServiceProvider.service;
    }
}
