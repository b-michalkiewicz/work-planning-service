import { ShiftDate } from "./shift-date";
import { WorkingShift } from "./working-shift";
import { isValidWorkingShifts, removeWorkingShift, updateWorkingShift, WorkingShifts } from "./working-shifts";

const ws2020 = new WorkingShift(ShiftDate.create(new Date("2020")) as ShiftDate, "day");
const ws2021 = new WorkingShift(ShiftDate.create(new Date("2021")) as ShiftDate, "day");
const ws2022 = new WorkingShift(ShiftDate.create(new Date("2022")) as ShiftDate, "day");
const ws2023 = new WorkingShift(ShiftDate.create(new Date("2023")) as ShiftDate, "day");
const ws2023Morning = new WorkingShift(ShiftDate.create(new Date("2023")) as ShiftDate, "morning");
const ws2023Night = new WorkingShift(ShiftDate.create(new Date("2023")) as ShiftDate, "night");

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
        expect(removeWorkingShift([ws2020, ws2021])(ShiftDate.create(new Date("2019")) as ShiftDate)).toEqual(
            new Error("Shift on 2019-1-1 not found."),
        );
    });

    it("modifies working shifts in happy flow", () => {
        expect(removeWorkingShift([ws2020, ws2021])(ShiftDate.create(new Date("2020")) as ShiftDate)).toEqual([ws2021]);
    });
});

describe("updateWorkingShift", () => {
    it("returns error when there is no shift at given date", () => {
        expect(updateWorkingShift([ws2020, ws2021])(ShiftDate.create(new Date("2019")) as ShiftDate, "night")).toEqual(
            new Error("Shift on 2019-1-1 not found."),
        );
    });

    it("modifies working shifts in happy flow", () => {
        expect(updateWorkingShift([ws2020, ws2021])(ShiftDate.create(new Date("2020")) as ShiftDate, "night")).toEqual([
            new WorkingShift(ws2020.date, "night"),
            ws2021,
        ]);
    });
});
