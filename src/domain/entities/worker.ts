import { createId, Id } from "../value-objects/id";
import { isError, Result } from "../value-objects/result";
import { ShiftKind } from "../value-objects/shift";
import { ShiftDate } from "../value-objects/shift-date";
import { WorkingShift } from "../value-objects/working-shift";
import { isValidWorkingShifts, removeWorkingShift, updateWorkingShift, WorkingShifts } from "../value-objects/working-shifts";

export class Worker {
    readonly id: Id;
    readonly firstName: string;
    readonly lastName: string;
    private readonly _workingShifts: WorkingShifts;

    static create(firstName: string, lastName: string, workingShifts: WorkingShifts, id?: Id): Result<Worker> {
        return isValidWorkingShifts(workingShifts)
            ? new Worker(firstName, lastName, workingShifts, id)
            : new Error("Worker cannot be created with invalid working shifts.");
    }

    private constructor(firstName: string, lastName: string, workingShifts: WorkingShifts, id?: Id) {
        this.id = id ? id : createId();
        this.firstName = firstName;
        this.lastName = lastName;
        this._workingShifts = workingShifts;
    }

    get workingShifts(): WorkingShifts {
        return [...this._workingShifts];
    }

    assignWorkingShift(workingShift: WorkingShift): Result<Worker> {
        const newWorkingShifts = [...this._workingShifts, workingShift];
        if (!isValidWorkingShifts(newWorkingShifts)) return new Error("Shift cannot be added.");

        return new Worker(this.firstName, this.lastName, newWorkingShifts, this.id);
    }

    unassignWorkingShift(onDate: ShiftDate): Result<Worker> {
        const updatedWorkingShifts = removeWorkingShift(this.workingShifts)(onDate);
        if (isError(updatedWorkingShifts)) return updatedWorkingShifts;

        return new Worker(this.firstName, this.lastName, updatedWorkingShifts, this.id);
    }

    changeWorkingShift(onDate: ShiftDate, update: ShiftKind): Result<Worker> {
        const updatedWorkingShifts = updateWorkingShift(this.workingShifts)(onDate, update);
        if (isError(updatedWorkingShifts)) return updatedWorkingShifts;

        return new Worker(this.firstName, this.lastName, updatedWorkingShifts, this.id);
    }
}
