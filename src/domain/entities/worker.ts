import { createId, Id } from "../value-objects/id";
import { Result } from "../value-objects/result";
import { isValidWorkingShifts, WorkingShift, WorkingShifts } from "./working-shift";

export class Worker {
    public readonly id: Id;

    static create(firstName: string, lastName: string, workShifts: WorkingShifts, id?: Id): Result<Worker> {
        return isValidWorkingShifts(workShifts)
            ? new Worker(firstName, lastName, workShifts, id)
            : new Error("Worker cannot be created with invalid working shifts.");
    }

    private constructor(
        readonly firstName: string,
        readonly lastName: string,
        private readonly _workingShifts: WorkingShifts,
        id?: Id,
    ) {
        this.id = id ? id : createId();
    }

    get workingShifts(): WorkingShifts {
        return [...this._workingShifts];
    }

    assignWorkingShift(workingShift: WorkingShift): Result<Worker> {
        const newWorkingShifts = [...this._workingShifts, workingShift];
        if (!isValidWorkingShifts(newWorkingShifts)) return new Error("Shift cannot be added.");

        return new Worker(this.firstName, this.lastName, newWorkingShifts, this.id);
    }
}
