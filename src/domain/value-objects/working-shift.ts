import { createShift, Shift, ShiftKind } from "./shift";
import { ShiftDate } from "./shift-date";

export class WorkingShift {
    readonly date: ShiftDate;
    readonly shift: Shift;

    constructor(date: Date, kind: ShiftKind);
    constructor(date: ShiftDate, kind: ShiftKind);
    constructor(date: ShiftDate | Date, kind: ShiftKind) {
        this.date = date instanceof Date ? new ShiftDate(date) : date;
        this.shift = createShift(kind);
    }
}
