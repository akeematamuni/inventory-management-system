import { Entity, BaseId } from '@inventory/core/domain';

export interface RefreshTokenEntityProps {
    refreshToken: string;
    userId: string;
    isRevoked: boolean;
    revokedAt?: Date;
    createdAt: Date;
    expiresAt?: Date;
}

export interface CreateRefreshTokenProps {
    refreshToken: string;
    userId: string;
    expiresAt?: Date;
}

export class RefreshTokenEntity extends Entity<RefreshTokenEntityProps> {
    private constructor(props: RefreshTokenEntityProps, id: string) {
        super(props, id);
    }

    public static create(props: CreateRefreshTokenProps): RefreshTokenEntity {
        return new RefreshTokenEntity(
            {
                ...props,
                isRevoked: false,
                createdAt: new Date()
            },
            BaseId.generate().value
        );
    }

    public static reconstitute(props: RefreshTokenEntityProps, id: string) {
        return new RefreshTokenEntity(props, id);
    }

    public isValid(): boolean {
        return !this.isRevoked;
    }

    public revoke(): void {
        if (this.isRevoked) {
            throw new Error('Refresh token already revoked');
        }

        this.props.isRevoked = true;
        this.props.revokedAt = new Date();
    }

    // Getters
    get refreshToken(): string {
        return this.props.refreshToken;
    }

    get userId(): string {
        return this.props.userId;
    }

    get isRevoked(): boolean {
        return this.props.isRevoked;
    }

    get revokedAt(): Date | undefined {
        return this.props.revokedAt || undefined;
    }

    get expiresAt(): Date | undefined {
        return this.props.expiresAt;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }
}
