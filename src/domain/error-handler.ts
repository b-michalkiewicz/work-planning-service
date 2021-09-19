import { BadRequestException, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { isError, isInvalidInputError, isNotFoundError, Result } from "./value-objects/result";

export const handleDomainError = <T>(result: Result<T>) => {
    if (isInvalidInputError(result)) throw new BadRequestException(result.message);
    if (isNotFoundError(result)) throw new NotFoundException(result.message);
    if (isError(result)) throw new InternalServerErrorException(result.message);

    return result;
};
