import { UnauthorizedException } from '@inventory/core/errors';

export class InvalidTokenException extends UnauthorizedException {
    constructor(reason?: string) {
        super(reason ? `Invalid token: ${reason}` : 'Invalid token', 'INVALID_TOKEN');
    }
}

export class TokenExpiredException extends UnauthorizedException {
    constructor() {
        super('Token has expired', 'TOKEN_EXPIRED');
    }
}

export class RefreshTokenRevokedException extends UnauthorizedException {
    constructor() {
        super('Refresh token has been revoked', 'REFRESH_TOKEN_REVOKED');
    }
}
