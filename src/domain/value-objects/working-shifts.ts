import { Result } from "./result";
import { ShiftKind } from "./shift";
import { ShiftDate } from "./shift-date";
import { WorkingShift } from "./working-shift";

export type WorkingShifts = ReadonlyArray<WorkingShift>;

export const isValidWorkingShifts = (workingShifts: WorkingShifts): boolean => isOneShiftADay(workingShifts);

export const removeWorkingShift =
    (workingShifts: WorkingShifts) =>
    (onDate: ShiftDate): Result<WorkingShifts> =>
        processWorkingShift(workingShifts)(onDate, (i, ws) => ws.splice(i, 1));

export const updateWorkingShift =
    (workingShifts: WorkingShifts) =>
    (onDate: ShiftDate, update: ShiftKind): Result<WorkingShifts> =>
        processWorkingShift(workingShifts)(onDate, (i, ws) => (ws[i] = new WorkingShift(onDate, update)));

const processWorkingShift =
    (workingShifts: WorkingShifts) =>
    (onDate: ShiftDate, processor: (i: number, ws: WorkingShift[]) => void): Result<WorkingShifts> => {
        const toProcessIndex = findWorkingShiftIndex(workingShifts)(onDate);
        if (toProcessIndex === -1) return new Error(`Shift on ${onDate} not found.`);

        const result = [...workingShifts];
        processor(toProcessIndex, result);

        return result;
    };

const isOneShiftADay = (workingShifts: WorkingShifts) => getWorkingShiftsOnTheSameDate(workingShifts).length === 0;

const getWorkingShiftsOnTheSameDate = (workingShifts: WorkingShifts) =>
    workingShifts.filter(({ date }, i, arr) => i !== findWorkingShiftIndex(arr)(date));

const findWorkingShiftIndex =
    (workingShifts: WorkingShifts) =>
    (onDate: ShiftDate): number =>
        workingShifts.findIndex(({ date }) => date.equals(onDate));
