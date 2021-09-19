import { Worker } from "src/domain/entities/worker";

export const convertWorkerToDto = (worker: Worker) => ({
    id: worker.id,
    firstName: worker.firstName,
    lastName: worker.lastName,
    workingShifts: worker.workingShifts.map(({ date, shift }) => ({
        year: date.year,
        month: date.month,
        day: date.day,
        ...shift,
    })),
});

export type WorkerDto = ReturnType<typeof convertWorkerToDto>;
