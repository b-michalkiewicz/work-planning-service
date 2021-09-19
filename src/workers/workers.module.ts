import { Module } from "@nestjs/common";
import { WorkersController } from "./workers.controller";
import { DomainWorkerServiceProvider, WorkersRepository } from "./workers.di";
import { InMemoryWorkersRepository } from "./workers.repository";
import { WorkersService } from "./workers.service";

@Module({
    controllers: [WorkersController],
    providers: [{ provide: WorkersRepository, useClass: InMemoryWorkersRepository }, DomainWorkerServiceProvider, WorkersService],
})
export class WorkersModule {}
