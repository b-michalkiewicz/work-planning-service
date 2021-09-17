import { createShift, Shift, ShiftKind } from "./shift";

describe("createShift", () => {
    it.each<{ givenKind: ShiftKind; expectedShift: Shift }>([
        { givenKind: "morning", expectedShift: { kind: "morning", from: 0, till: 8 } },
        { givenKind: "day", expectedShift: { kind: "day", from: 8, till: 16 } },
        { givenKind: "night", expectedShift: { kind: "night", from: 16, till: 24 } },
    ])("creates correct shift kind: %j", ({ givenKind: given, expectedShift: expected }) =>
        expect(createShift(given)).toEqual(expected),
    );
});
