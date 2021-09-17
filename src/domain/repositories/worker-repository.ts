import { Worker } from "../entities/worker";
import { Id } from "../value-objects/id";
import { Result } from "../value-objects/result";

export interface WorkerRepository {
    getById(id: Id): Promise<Worker | undefined>;
    save(worker: Worker): Promise<Result<Worker>>;
    delete(id: Id): Promise<Result<void>>;
}
