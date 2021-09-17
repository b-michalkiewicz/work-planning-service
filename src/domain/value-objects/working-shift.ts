import { createShift, Shift, ShiftKind } from "./shift";
import { ShiftDate } from "./shift-date";

export class WorkingShift {
    readonly date: ShiftDate;
    readonly shift: Shift;

    constructor(date: ShiftDate, kind: ShiftKind) {
        this.date = date;
        this.shift = createShift(kind);
    }
}
