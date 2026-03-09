import { NotFoundException, BadRequestException, UnauthorizedException } from "@inventory/core/errors";

export class UserNotFoundException extends NotFoundException {
    constructor(identifier: string) {
        super(`User not found: ${identifier}`, 'USER_NOT_FOUND');
    }
}

export class InvalidPasswordException extends BadRequestException {
    constructor(errors: string[]) {
        super(`Invalid password: ${errors.join(', ')}`, 'INVALID_PASSWORD');
    }
}

export class InvalidCredentialsException extends UnauthorizedException {
    constructor() {
        super('Invalid email or password', 'INVALID_CREDENTIALs');
    }
}
