import { ValueObject } from "@inventory/core/domain";

export interface PasswordHashProps {
    value: string;
}

export class PasswordHash extends ValueObject<PasswordHashProps> {
    private constructor(props: PasswordHashProps) {
        super(props);
    }

    public static create(hashedPassword: string): PasswordHash {
        if (!hashedPassword) {
            throw new Error('Password hash cannot be empty');
        }

        if (hashedPassword.length !== 60) {
            throw new Error('Invalid bcrypt hash format');
        }

        return new PasswordHash({ value: hashedPassword });
    }

    get value(): string {
        return this.props.value;
    }
}
