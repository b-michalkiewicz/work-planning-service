import { isError } from "./result";
import { ShiftDate } from "./shift-date";

describe("ShiftDate", () => {
    it.each([
        { shiftDate: ShiftDate.create(new Date("2021")), expected: { year: 2021, month: 1, day: 1 } },
        { shiftDate: ShiftDate.create(new Date("2021-09")), expected: { year: 2021, month: 9, day: 1 } },
        { shiftDate: ShiftDate.create(new Date("2021-08-31")), expected: { year: 2021, month: 8, day: 31 } },
        { shiftDate: ShiftDate.create(new Date("2021-08-31 13:00")), expected: { year: 2021, month: 8, day: 31 } },
        { shiftDate: ShiftDate.create(new Date("2021-08-32 13:00")), expected: { error: true } },
    ])("interprets input dates correct: %j", ({ shiftDate, expected }) => {
        if (expected.error) {
            expect(shiftDate).toEqual(new Error("ShiftDate cannot be created from invalid date."));
            return;
        }

        if (isError(shiftDate)) fail();
        expect(shiftDate.year).toEqual(expected.year);
        expect(shiftDate.month).toEqual(expected.month);
        expect(shiftDate.day).toEqual(expected.day);
    });

    it.each([
        { given: ShiftDate.create(new Date("2021")), equal: ShiftDate.create(new Date("2021-01-01")) },
        { given: ShiftDate.create(new Date("2021")), equal: ShiftDate.create(new Date("2021-01-01 13:00")) },
        { given: ShiftDate.create(new Date("2021-01")), equal: ShiftDate.create(new Date("2021-01-01")) },
        { given: ShiftDate.create(new Date("2021-01")), equal: ShiftDate.create(new Date("2021-01-01 13:00")) },
        { given: ShiftDate.create(new Date("2021-01-01")), equal: ShiftDate.create(new Date("2021-01-01")) },
        { given: ShiftDate.create(new Date("2021-01-01")), equal: ShiftDate.create(new Date("2021-01-01 13:00")) },
        { given: ShiftDate.create(new Date("2021-01-01 15:00")), equal: ShiftDate.create(new Date("2021-01-01")) },
        { given: ShiftDate.create(new Date("2021-01-01 15:00")), equal: ShiftDate.create(new Date("2021-01-01 13:00")) },
    ])("compares the same shift dates correct: %j", ({ given: sd1, equal: sd2 }) => {
        if (isError(sd1)) fail();
        if (isError(sd2)) fail();

        expect(sd1.equals(sd2)).toEqual(true);
    });

    it.each([
        { given: ShiftDate.create(new Date("2021")), notEqual: ShiftDate.create(new Date("2022")) },
        { given: ShiftDate.create(new Date("2021")), notEqual: ShiftDate.create(new Date("2022-01-01 13:00")) },
        { given: ShiftDate.create(new Date("2021-01")), notEqual: ShiftDate.create(new Date("2022-01-01")) },
        { given: ShiftDate.create(new Date("2021-01")), notEqual: ShiftDate.create(new Date("2022-01-01 13:00")) },
        { given: ShiftDate.create(new Date("2021-01-01")), notEqual: ShiftDate.create(new Date("2022-01-01")) },
        { given: ShiftDate.create(new Date("2021-01-01")), notEqual: ShiftDate.create(new Date("2022-01-01 13:00")) },
        { given: ShiftDate.create(new Date("2021-01-01 15:00")), notEqual: ShiftDate.create(new Date("2022-01-01")) },
        { given: ShiftDate.create(new Date("2021-01-01 15:00")), notEqual: ShiftDate.create(new Date("2022-01-01 13:00")) },
    ])("compares different shift dates correct: %j", ({ given: sd1, notEqual: sd2 }) => {
        if (isError(sd1)) fail();
        if (isError(sd2)) fail();

        expect(sd1.equals(sd2)).toEqual(false);
    });
});
