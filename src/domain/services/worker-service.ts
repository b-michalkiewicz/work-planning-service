import { Worker } from "../entities/worker";
import { WorkerRepository } from "../repositories/worker-repository";
import { Id } from "../value-objects/id";
import { isError, Result } from "../value-objects/result";
import { ShiftKind } from "../value-objects/shift";
import { ShiftDate } from "../value-objects/shift-date";
import { WorkingShift } from "../value-objects/working-shift";

export class WorkerService {
    constructor(private readonly repository: WorkerRepository) {}

    async findWorker(workerId: Id): Promise<Result<Worker>> {
        const worker = await this.repository.getById(workerId);
        return worker ? worker : new Error(`Worker with ${workerId} not found.`);
    }

    async removeWorker(workerId: Id): Promise<Result<void>> {
        return this.repository.delete(workerId);
    }

    async assignWorkingShift(workerId: Id, workingShift: WorkingShift): Promise<Result<Worker>> {
        return this.mapAndSafeWorker(workerId, (worker) => worker.assignWorkingShift(workingShift));
    }

    async unassignWorkingShift(workerId: Id, onDate: ShiftDate): Promise<Result<Worker>> {
        return this.mapAndSafeWorker(workerId, (worker) => worker.unassignWorkingShift(onDate));
    }

    async changeWorkingShift(workerId: Id, onDate: ShiftDate, toKind: ShiftKind): Promise<Result<Worker>> {
        return this.mapAndSafeWorker(workerId, (worker) => worker.changeWorkingShift(onDate, toKind));
    }

    private async mapAndSafeWorker(workerId: Id, mapper: (w: Worker) => Result<Worker>) {
        const worker = await this.findWorker(workerId);
        if (isError(worker)) return worker;

        const mapped = mapper(worker);
        return isError(mapped) ? mapped : this.repository.save(mapped);
    }
}
