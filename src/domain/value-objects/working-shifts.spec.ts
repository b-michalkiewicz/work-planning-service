import { NotFoundError } from "./result";
import { ShiftDate } from "./shift-date";
import { WorkingShift } from "./working-shift";
import { isValidWorkingShifts, removeWorkingShift, updateWorkingShift, WorkingShifts } from "./working-shifts";

const ws2020 = new WorkingShift(ShiftDate.create({ year: 2020, month: 1, day: 1 }) as ShiftDate, "day");
const ws2021 = new WorkingShift(ShiftDate.create({ year: 2021, month: 1, day: 1 }) as ShiftDate, "day");
const ws2022 = new WorkingShift(ShiftDate.create({ year: 2022, month: 1, day: 1 }) as ShiftDate, "day");
const ws2023 = new WorkingShift(ShiftDate.create({ year: 2023, month: 1, day: 1 }) as ShiftDate, "day");
const ws2023Morning = new WorkingShift(ShiftDate.create({ year: 2023, month: 1, day: 1 }) as ShiftDate, "morning");
const ws2023Night = new WorkingShift(ShiftDate.create({ year: 2023, month: 1, day: 1 }) as ShiftDate, "night");

describe("isValidWorkingShifts", () => {
    it.each<WorkingShifts>([[], [ws2020], [ws2020, ws2021], [ws2020, ws2021, ws2022], [ws2020, ws2021, ws2022, ws2023]])(
        "%#. returns true for valid working shifts",
        (...ws) => expect(isValidWorkingShifts(ws)).toEqual(true),
    );

    it.each<WorkingShifts>([
        [ws2020, ws2020],
        [ws2020, ws2021, ws2021],
        [ws2020, ws2021, ws2020, ws2023],
        [ws2023, ws2023Morning],
        [ws2023Night, ws2023Morning],
    ])("%#. returns false for invalid working shifts", (...ws) => expect(isValidWorkingShifts(ws)).toEqual(false));
});

describe("removeWorkingShift", () => {
    it("returns error when there is no shift at given date", () => {
        expect(removeWorkingShift([ws2020, ws2021])(ShiftDate.create({ year: 2019, month: 1, day: 1 }) as ShiftDate)).toEqual(
            new NotFoundError("Shift on 2019-01-01 not found."),
        );
    });

    it("modifies working shifts in happy flow", () => {
        expect(removeWorkingShift([ws2020, ws2021])(ShiftDate.create({ year: 2020, month: 1, day: 1 }) as ShiftDate)).toEqual([
            ws2021,
        ]);
    });
});

describe("updateWorkingShift", () => {
    it("returns error when there is no shift at given date", () => {
        expect(
            updateWorkingShift([ws2020, ws2021])(ShiftDate.create({ year: 2019, month: 1, day: 1 }) as ShiftDate, "night"),
        ).toEqual(new NotFoundError("Shift on 2019-01-01 not found."));
    });

    it("modifies working shifts in happy flow", () => {
        expect(
            updateWorkingShift([ws2020, ws2021])(ShiftDate.create({ year: 2020, month: 1, day: 1 }) as ShiftDate, "night"),
        ).toEqual([new WorkingShift(ws2020.date, "night"), ws2021]);
    });
});
