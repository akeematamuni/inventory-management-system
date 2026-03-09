export class UserEmailVerifiedEvent {
    constructor(
        public readonly email: string,
        public readonly occurredAt: Date = new Date()
    ) {}
}
