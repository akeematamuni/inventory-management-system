import { ValueObject } from "@inventory/core/domain";

export interface TokenPayloadProps {
    userId: string;
    email: string;
}

export class TokenPayload extends ValueObject<TokenPayloadProps> {
    private constructor(props: TokenPayloadProps) {
        super(props);
    }

    public static create(props: TokenPayloadProps): TokenPayload {
        if (!props.userId) throw new Error('Token payload must include user ID!');
        if (!props.email) throw new Error('Token payload must include user email!');
        return new TokenPayload(props);
    }

    public toPlainObject(): TokenPayloadProps {
        return {
            userId: this.userId,
            email: this.email
        };
    }

    // Getters
    get userId(): string {
        return this.props.userId;
    }

    get email(): string {
        return this.props.email;
    }
}
