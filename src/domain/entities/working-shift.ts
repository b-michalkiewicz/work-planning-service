import { createId, Id } from "../value-objects/id";
import { createShift, Shift, ShiftKind } from "../value-objects/shift";
import { ShiftDate } from "../value-objects/shift-date";

export class WorkingShift {
    public readonly id: Id;
    public readonly date: ShiftDate;
    public readonly shift: Shift;

    constructor(date: Date, kind: ShiftKind, id?: Id) {
        this.date = new ShiftDate(date);
        this.shift = createShift(kind);
        this.id = id ? id : createId();
    }
}

export type WorkingShifts = ReadonlyArray<WorkingShift>;

export const isValidWorkingShifts = (workShifts: WorkingShifts): boolean =>
    getWorkingShiftsOnDifferentDate(workShifts).length === workShifts.length;

const getWorkingShiftsOnDifferentDate = (workShifts: WorkingShifts) =>
    workShifts.filter((ws, index, arr) => index === arr.findIndex(({ date }) => ws.date.equals(date)));
