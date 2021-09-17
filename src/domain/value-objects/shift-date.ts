export class ShiftDate {
    readonly year: number;
    readonly month: number;
    readonly day: number;

    constructor(date: Date) {
        this.year = date.getFullYear();
        this.month = date.getMonth();
        this.day = date.getDay();
    }

    equals({ year, month, day }: ShiftDate): boolean {
        return this.year === year && this.month === month && this.day === day;
    }
}
