export class UserRegisteredEvent {
    constructor(
        public readonly userId: string,
        public readonly email: string,
        public readonly verificationToken: string,
        public readonly occurredAt: Date = new Date()
    ) {}
}

export class UserLoggedInEvent {
    constructor(
        public readonly userId: string,
        public readonly email: string,
        public readonly occurredAt: Date = new Date()
    ) {}
}

export class TokenRefreshedEvent {
    constructor(
        public readonly userId: string,
        public readonly oldToken: string,
        public readonly newToken: string,
        public readonly occurredAt: Date = new Date()
    ) {}
}
