import { createId, Id } from "../value-objects/id";
import { InvalidInputError, isError, Result } from "../value-objects/result";
import { ShiftKind } from "../value-objects/shift";
import { ShiftDate } from "../value-objects/shift-date";
import { WorkingShift } from "../value-objects/working-shift";
import { isValidWorkingShifts, removeWorkingShift, updateWorkingShift, WorkingShifts } from "../value-objects/working-shifts";

export type WorkerProps = {
    id?: Id;
    firstName: string;
    lastName: string;
    workingShifts: WorkingShifts;
};

export type WorkerUpdate = Partial<Pick<WorkerProps, "firstName" | "lastName">>;

export class Worker {
    static create(props: WorkerProps): Result<Worker> {
        const { firstName, lastName, workingShifts, id } = props;
        if (!firstName || !lastName) return new InvalidInputError("Worker cannot be created with empty first or last name.");

        if (!isValidWorkingShifts(workingShifts))
            return new InvalidInputError("Worker cannot be created with invalid working shifts.");

        return new Worker({ ...props, id: id ? id : createId() });
    }

    private constructor(private readonly props: WorkerProps & { id: Id }) {}

    get id(): Id {
        return this.props.id;
    }

    get workingShifts(): WorkingShifts {
        return [...this.props.workingShifts];
    }

    get firstName(): string {
        return this.props.firstName;
    }

    get lastName(): string {
        return this.props.lastName;
    }

    assignWorkingShift(workingShift: WorkingShift): Result<Worker> {
        const newWorkingShifts = [...this.workingShifts, workingShift];
        if (!isValidWorkingShifts(newWorkingShifts)) return new InvalidInputError("Shift cannot be added.");

        return new Worker({ ...this.props, workingShifts: newWorkingShifts });
    }

    unassignWorkingShift(onDate: ShiftDate): Result<Worker> {
        const updatedWorkingShifts = removeWorkingShift(this.workingShifts)(onDate);
        if (isError(updatedWorkingShifts)) return updatedWorkingShifts;

        return new Worker({ ...this.props, workingShifts: updatedWorkingShifts });
    }

    changeWorkingShift(onDate: ShiftDate, toKind: ShiftKind): Result<Worker> {
        const updatedWorkingShifts = updateWorkingShift(this.workingShifts)(onDate, toKind);
        if (isError(updatedWorkingShifts)) return updatedWorkingShifts;

        return new Worker({ ...this.props, workingShifts: updatedWorkingShifts });
    }

    update(update: WorkerUpdate): Worker {
        return new Worker({ ...this.props, ...update });
    }
}
