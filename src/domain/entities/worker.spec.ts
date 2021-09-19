import { createId, Id } from "../value-objects/id";
import { InvalidInputError, isError, NotFoundError } from "../value-objects/result";
import { ShiftDate } from "../value-objects/shift-date";
import { WorkingShift } from "../value-objects/working-shift";
import { Worker } from "./worker";

const ws2020 = new WorkingShift(ShiftDate.create({ year: 2020, month: 1, day: 1 }) as ShiftDate, "day");
const ws2021 = new WorkingShift(ShiftDate.create({ year: 2021, month: 1, day: 1 }) as ShiftDate, "day");
const nameWorkerProps = { firstName: "firstName", lastName: "lastName" };

describe("Worker", () => {
    describe("create", () => {
        it.each<{ firstName: string; lastName: string }>([
            { firstName: "", lastName: "" },
            { firstName: "", lastName: "lastName" },
            { firstName: "firstName", lastName: "" },
        ])("returns error for empty first or last name: %p", (nameProps) => {
            expect(Worker.create({ ...nameProps, workingShifts: [] })).toEqual(
                new InvalidInputError("Worker cannot be created with empty first or last name."),
            );
        });

        it("returns error for invalid working shifts", () => {
            expect(Worker.create({ ...nameWorkerProps, workingShifts: [ws2020, ws2020] })).toEqual(
                new InvalidInputError("Worker cannot be created with invalid working shifts."),
            );
        });

        it("creates correct worker and assigns id", () => {
            assertAndGetCorrectWorker();
        });

        it("creates correct worker with given id", () => {
            assertAndGetCorrectWorker(createId());
        });
    });

    describe("assignWorkingShift", () => {
        it("returns error when assign more than one working shift in a day", () => {
            expect(assertAndGetCorrectWorker().assignWorkingShift(ws2020)).toEqual(
                new InvalidInputError("Shift cannot be added."),
            );
        });

        it("assigns new working shift", () => {
            const worker = assertAndGetCorrectWorker().assignWorkingShift(ws2021);
            if (isError(worker)) fail();
            expect(worker.workingShifts).toEqual([ws2020, ws2021]);
        });
    });

    describe("unassignWorkingShift", () => {
        it("returns error when there is no shift at given day", () => {
            expect(assertAndGetCorrectWorker().unassignWorkingShift(ws2021.date)).toEqual(
                new NotFoundError("Shift on 2021-01-01 not found."),
            );
        });

        it("removes working shift", () => {
            const worker = assertAndGetCorrectWorker().unassignWorkingShift(ws2020.date);
            if (isError(worker)) fail();
            expect(worker.workingShifts).toEqual([]);
        });
    });

    describe("changeWorkingShift", () => {
        it("returns error when there is no shift at given day", () => {
            expect(assertAndGetCorrectWorker().changeWorkingShift(ws2021.date, "morning")).toEqual(
                new NotFoundError("Shift on 2021-01-01 not found."),
            );
        });

        it("changes working shift", () => {
            const worker = assertAndGetCorrectWorker().changeWorkingShift(ws2020.date, "night");
            if (isError(worker)) fail();
            expect(worker.workingShifts).toEqual([
                new WorkingShift(ShiftDate.create({ year: 2020, month: 1, day: 1 }) as ShiftDate, "night"),
            ]);
        });
    });

    const assertAndGetCorrectWorker = (id?: Id) => {
        const worker = Worker.create({ ...nameWorkerProps, workingShifts: [ws2020], id });
        if (isError(worker)) fail();

        expect(worker.firstName).toEqual(nameWorkerProps.firstName);
        expect(worker.lastName).toEqual(nameWorkerProps.lastName);
        expect(worker.workingShifts).toEqual([ws2020]);
        expect(worker.id).toBeDefined();

        if (id) {
            expect(worker.id).toEqual(id);
        }

        return worker;
    };
});
