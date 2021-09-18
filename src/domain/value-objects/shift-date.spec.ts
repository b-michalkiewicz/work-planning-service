import { isError } from "./result";
import { ShiftDate } from "./shift-date";

describe("ShiftDate", () => {
    it.each([
        {
            given: ShiftDate.create({ year: 1987, month: 4, day: 10 }),
            expectedValue: { year: 1987, month: 4, day: 10 },
            expectedString: "1987-04-10",
        },
        {
            given: ShiftDate.create({ year: 1988, month: 3, day: 4 }),
            expectedValue: { year: 1988, month: 3, day: 4 },
            expectedString: "1988-03-04",
        },
        {
            given: ShiftDate.create({ year: 2021, month: 8, day: 29 }),
            expectedValue: { year: 2021, month: 8, day: 29 },
            expectedString: "2021-08-29",
        },
        { given: ShiftDate.create({ year: 2021, month: 8, day: 32 }), expectedValue: { error: true } },
    ])("interprets input dates correct: %j", ({ given, expectedValue, expectedString }) => {
        if (expectedValue.error) {
            expect(given).toEqual(new Error("ShiftDate cannot be created from invalid date."));
            return;
        }

        if (isError(given)) fail();

        expect(given.year).toEqual(expectedValue.year);
        expect(given.month).toEqual(expectedValue.month);
        expect(given.day).toEqual(expectedValue.day);
        expect(given.toString()).toEqual(expectedString);
    });

    it.each([
        {
            given: ShiftDate.create({ year: 1987, month: 4, day: 10 }),
            toEqual: ShiftDate.create({ year: 1987, month: 4, day: 10 }),
        },
        {
            given: ShiftDate.create({ year: 1988, month: 3, day: 4 }),
            toEqual: ShiftDate.create({ year: 1988, month: 3, day: 4 }),
        },
        {
            given: ShiftDate.create({ year: 2021, month: 8, day: 29 }),
            toEqual: ShiftDate.create({ year: 2021, month: 8, day: 29 }),
        },
    ])("compares the same shift dates correct: %j", ({ given, toEqual }) => {
        if (isError(given)) fail();
        if (isError(toEqual)) fail();

        expect(given.equals(toEqual)).toEqual(true);
    });

    it.each([
        {
            given: ShiftDate.create({ year: 1987, month: 4, day: 10 }),
            notEqual: ShiftDate.create({ year: 1988, month: 3, day: 4 }),
        },
        {
            given: ShiftDate.create({ year: 1988, month: 3, day: 4 }),
            notEqual: ShiftDate.create({ year: 1987, month: 4, day: 10 }),
        },
        {
            given: ShiftDate.create({ year: 2021, month: 8, day: 29 }),
            notEqual: ShiftDate.create({ year: 2021, month: 9, day: 18 }),
        },
    ])("compares different shift dates correct: %j", ({ given, notEqual }) => {
        if (isError(given)) fail();
        if (isError(notEqual)) fail();

        expect(given.equals(notEqual)).toEqual(false);
    });
});
