import { Result } from "./result";

export class ShiftDate {
    readonly year: number;
    readonly month: number;
    readonly day: number;

    static create(date: Date): Result<ShiftDate> {
        return Number.isNaN(date.valueOf()) ? new Error("ShiftDate cannot be created from invalid date.") : new ShiftDate(date);
    }

    private constructor(date: Date) {
        this.year = date.getFullYear();
        this.month = date.getMonth() + 1; // thank you JavaScript
        this.day = date.getDate();
    }

    equals({ year, month, day }: ShiftDate): boolean {
        return this.year === year && this.month === month && this.day === day;
    }

    toString(): string {
        return `${this.year}-${this.month}-${this.day}`;
    }
}
