import { Worker } from "../entities/worker";
import { WorkerRepository } from "../repositories/worker-repository";
import { Id } from "../value-objects/id";
import { ShiftDate } from "../value-objects/shift-date";
import { WorkingShift } from "../value-objects/working-shift";
import { WorkerService } from "./worker-service";

beforeEach(() => {
    jest.resetAllMocks();
});

describe("WorkerService", () => {
    describe("findWorker", () => {
        it("returns error when worker is not found", async () => {
            getByIdMock.mockResolvedValue(undefined);

            expect(await service.findWorker(workerId)).toEqual(new Error(`Worker with ${workerId} not found.`));
        });

        it("returns worker and calls functions with proper arguments - happy flo", async () => {
            getByIdMock.mockResolvedValue(workerMock);

            expect(await service.findWorker(workerId)).toEqual(workerMock);
            expect(getByIdMock).toHaveBeenCalledWith(workerId);
        });
    });

    describe("assignWorkingShift", () => {
        it("returns error when worker is not found", async () => {
            getByIdMock.mockResolvedValue(undefined);

            expect(await service.assignWorkingShift(workerId, ws)).toEqual(new Error(`Worker with ${workerId} not found.`));
        });

        it("returns error when assignWorkingShift fails", async () => {
            getByIdMock.mockResolvedValue(workerMock);
            assignWorkingShiftMock.mockReturnValue(new Error("error"));

            expect(await service.assignWorkingShift(workerId, ws)).toEqual(new Error("error"));
            expect(saveMock).toHaveBeenCalledTimes(0);
        });

        it("returns error when save fails", async () => {
            getByIdMock.mockResolvedValue(workerMock);
            saveMock.mockResolvedValue(new Error("error"));
            assignWorkingShiftMock.mockReturnValue(workerMock);

            expect(await service.assignWorkingShift(workerId, ws)).toEqual(new Error("error"));
        });

        it("returns worker and calls functions with proper arguments - happy flow", async () => {
            getByIdMock.mockResolvedValue(workerMock);
            saveMock.mockResolvedValue(workerMock);
            assignWorkingShiftMock.mockReturnValue(workerMock);

            expect(await service.assignWorkingShift(workerId, ws)).toEqual(workerMock);
            expect(getByIdMock).toHaveBeenCalledWith(workerId);
            expect(saveMock).toHaveBeenCalledWith(workerMock);
            expect(assignWorkingShiftMock).toHaveBeenCalledWith(ws);
        });
    });

    describe("unassignWorkingShift", () => {
        it("returns error when worker is not found", async () => {
            getByIdMock.mockResolvedValue(undefined);

            expect(await service.unassignWorkingShift(workerId, ws.date)).toEqual(
                new Error(`Worker with ${workerId} not found.`),
            );
        });

        it("returns error when unassignWorkingShift fails", async () => {
            getByIdMock.mockResolvedValue(workerMock);
            unassignWorkingShiftMock.mockReturnValue(new Error("error"));

            expect(await service.unassignWorkingShift(workerId, ws.date)).toEqual(new Error("error"));
            expect(saveMock).toHaveBeenCalledTimes(0);
        });

        it("returns error when save fails", async () => {
            getByIdMock.mockResolvedValue(workerMock);
            saveMock.mockResolvedValue(new Error("error"));
            unassignWorkingShiftMock.mockReturnValue(workerMock);

            expect(await service.unassignWorkingShift(workerId, ws.date)).toEqual(new Error("error"));
        });

        it("returns worker and calls functions with proper arguments - happy flow", async () => {
            getByIdMock.mockResolvedValue(workerMock);
            saveMock.mockResolvedValue(workerMock);
            unassignWorkingShiftMock.mockReturnValue(workerMock);

            expect(await service.unassignWorkingShift(workerId, ws.date)).toEqual(workerMock);
            expect(getByIdMock).toHaveBeenCalledWith(workerId);
            expect(saveMock).toHaveBeenCalledWith(workerMock);
            expect(unassignWorkingShiftMock).toHaveBeenCalledWith(ws.date);
        });
    });

    describe("changeWorkingShift", () => {
        it("returns error when worker is not found", async () => {
            getByIdMock.mockResolvedValue(undefined);

            expect(await service.changeWorkingShift(workerId, ws.date, "night")).toEqual(
                new Error(`Worker with ${workerId} not found.`),
            );
        });

        it("returns error when changeWorkingShift fails", async () => {
            getByIdMock.mockResolvedValue(workerMock);
            changeWorkingShiftMock.mockReturnValue(new Error("error"));

            expect(await service.changeWorkingShift(workerId, ws.date, "night")).toEqual(new Error("error"));
            expect(saveMock).toHaveBeenCalledTimes(0);
        });

        it("returns error when save fails", async () => {
            getByIdMock.mockResolvedValue(workerMock);
            saveMock.mockResolvedValue(new Error("error"));
            changeWorkingShiftMock.mockReturnValue(workerMock);

            expect(await service.changeWorkingShift(workerId, ws.date, "night")).toEqual(new Error("error"));
        });

        it("returns worker and calls functions with proper arguments - happy flow", async () => {
            getByIdMock.mockResolvedValue(workerMock);
            saveMock.mockResolvedValue(workerMock);
            changeWorkingShiftMock.mockReturnValue(workerMock);

            expect(await service.changeWorkingShift(workerId, ws.date, "night")).toEqual(workerMock);
            expect(getByIdMock).toHaveBeenCalledWith(workerId);
            expect(saveMock).toHaveBeenCalledWith(workerMock);
            expect(changeWorkingShiftMock).toHaveBeenCalledWith(ws.date, "night");
        });
    });
});

const getByIdMock = jest.fn();
const saveMock = jest.fn();
const deleteMock = jest.fn();
const mockRepository: WorkerRepository = {
    getById: getByIdMock,
    save: saveMock,
    delete: deleteMock,
};

const assignWorkingShiftMock = jest.fn();
const unassignWorkingShiftMock = jest.fn();
const changeWorkingShiftMock = jest.fn();
const workerMock: Worker = {
    assignWorkingShift: assignWorkingShiftMock as any,
    unassignWorkingShift: unassignWorkingShiftMock as any,
    changeWorkingShift: changeWorkingShiftMock as any,
} as Worker;

const service = new WorkerService(mockRepository);
const workerId = "id" as Id;
const ws = new WorkingShift(ShiftDate.create({ year: 2020, month: 1, day: 1 }) as ShiftDate, "day");
