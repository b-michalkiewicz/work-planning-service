import { Injectable } from "@nestjs/common";
import { Worker } from "src/domain/entities/worker";
import { WorkerRepository } from "src/domain/repositories/worker-repository";
import { Id } from "src/domain/value-objects/id";
import { NotFoundError, Result } from "src/domain/value-objects/result";

@Injectable()
export class InMemoryWorkersRepository implements WorkerRepository {
    private workers: Worker[] = [];

    getById(id: Id): Promise<Worker | undefined> {
        return Promise.resolve(this.workers.find((w) => w.id === id));
    }

    async save(worker: Worker): Promise<Result<Worker>> {
        const inRepo = await this.getById(worker.id);
        if (inRepo) {
            await this.delete(inRepo.id);
        }
        this.workers = [...this.workers, worker];
        return worker;
    }

    async delete(id: Id): Promise<Result<void>> {
        const inRepo = await this.getById(id);
        if (!inRepo) return new NotFoundError(`Worker with ${id} not found.`);
        this.workers = this.workers.filter((w) => w.id !== inRepo.id);
    }
}
