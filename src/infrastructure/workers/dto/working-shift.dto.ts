import { Type } from "class-transformer";
import { IsIn, IsNotEmptyObject, IsNumber, ValidateNested } from "class-validator";
import { ShiftKind } from "src/domain/value-objects/shift";
import { ShiftDateProps } from "src/domain/value-objects/shift-date";

export class ShiftDateDto implements ShiftDateProps {
    @IsNumber()
    year!: number;
    @IsNumber()
    month!: number;
    @IsNumber()
    day!: number;
}

const shiftKinds: ReadonlyArray<ShiftKind> = ["morning", "day", "night"] as const;

export class WorkingShiftDto {
    @IsIn(shiftKinds)
    kind!: ShiftKind;
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => ShiftDateDto)
    date!: ShiftDateDto;
}
