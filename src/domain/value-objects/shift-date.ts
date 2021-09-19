import { Result } from "./result";

export type ShiftDateProps = {
    year: number;
    month: number;
    day: number;
};

export class ShiftDate {
    private readonly props: ShiftDateProps;

    static create(props: ShiftDateProps): Result<ShiftDate> {
        return Number.isNaN(new Date(shiftDatePropsToString(props)).valueOf())
            ? new Error(`ShiftDate cannot be created from ${JSON.stringify(props)}.`)
            : new ShiftDate(props);
    }

    private constructor(props: ShiftDateProps) {
        this.props = props;
    }

    get year(): number {
        return this.props.year;
    }

    get month(): number {
        return this.props.month;
    }

    get day(): number {
        return this.props.day;
    }

    equals({ year, month, day }: ShiftDate): boolean {
        return this.year === year && this.month === month && this.day === day;
    }

    toString(): string {
        return shiftDatePropsToString(this.props);
    }
}

const padWithLeadingZero = (s: string) => (s.length < 2 ? s.padStart(2, "0") : s);
const shiftDatePropsToString = ({ year, month, day }: ShiftDateProps) =>
    `${year}-${padWithLeadingZero(month.toString())}-${padWithLeadingZero(day.toString())}`;
