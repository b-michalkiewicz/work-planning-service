export type MorningShift = {
    kind: "morning";
    from: 0;
    till: 8;
};

export type DayShift = {
    kind: "day";
    from: 8;
    till: 16;
};

export type NighShift = {
    kind: "night";
    from: 16;
    till: 24;
};

export type Shift = MorningShift | DayShift | NighShift;
export type ShiftKind = Shift["kind"];

export const createShift = (kind: ShiftKind): Shift => {
    switch (kind) {
        case "morning":
            return { kind, from: 0, till: 8 };
        case "day":
            return { kind, from: 8, till: 16 };
        case "night":
            return { kind, from: 16, till: 24 };
    }
};
