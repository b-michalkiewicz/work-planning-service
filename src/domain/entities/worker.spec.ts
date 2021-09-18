import { createId, Id } from "../value-objects/id";
import { isError } from "../value-objects/result";
import { ShiftDate } from "../value-objects/shift-date";
import { WorkingShift } from "../value-objects/working-shift";
import { Worker } from "./worker";

const ws2020 = new WorkingShift(ShiftDate.create({ year: 2020, month: 1, day: 1 }) as ShiftDate, "day");
const ws2021 = new WorkingShift(ShiftDate.create({ year: 2021, month: 1, day: 1 }) as ShiftDate, "day");

describe("Worker", () => {
    describe("create", () => {
        it.each<[string, string]>([
            ["", ""],
            ["", "last"],
            ["first", ""],
        ])("returns error for empty first(%p) or last name(%p)", (...[fn, ln]) => {
            expect(Worker.create(fn, ln, [])).toEqual(new Error("Worker cannot be created with empty first or last name."));
        });

        it("returns error for invalid working shifts", () => {
            expect(Worker.create("fn", "ln", [ws2020, ws2020])).toEqual(
                new Error("Worker cannot be created with invalid working shifts."),
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
            expect(assertAndGetCorrectWorker().assignWorkingShift(ws2020)).toEqual(new Error("Shift cannot be added."));
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
                new Error("Shift on 2021-01-01 not found."),
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
                new Error("Shift on 2021-01-01 not found."),
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
        const worker = Worker.create("fn", "ln", [ws2020], id);
        if (isError(worker)) fail();

        expect(worker.firstName).toEqual("fn");
        expect(worker.lastName).toEqual("ln");
        expect(worker.workingShifts).toEqual([ws2020]);
        expect(worker.id).toBeDefined();

        if (id) {
            expect(worker.id).toEqual(id);
        }

        return worker;
    };
});
