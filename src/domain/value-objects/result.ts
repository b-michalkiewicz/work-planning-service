abstract class Error {
    constructor(public readonly message: string) {}
}
export class NotFoundError extends Error {}
export const isNotFoundError = (e: any): e is NotFoundError => e instanceof NotFoundError;

export class InvalidInputError extends Error {}
export const isInvalidInputError = (e: any): e is InvalidInputError => e instanceof InvalidInputError;

export type Result<T> = Error | T;
export const isError = (r: Result<any>): r is Error => r instanceof Error;
