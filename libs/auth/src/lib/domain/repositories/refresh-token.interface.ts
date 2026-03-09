import { RefreshTokenEntity } from "../entities/refresh-token.entity";

export interface IRefreshTokenRepository {
    save(refreshToken: RefreshTokenEntity): Promise<RefreshTokenEntity>;

    findByToken(token: string): Promise<RefreshTokenEntity | null>;
    findByUserId(userId: string): Promise<RefreshTokenEntity[]>;
    findValidByUserId(userId: string): Promise<RefreshTokenEntity[]>;

    revokeByToken(token: string): Promise<void>;
    revokeAllByUserId(userId: string): Promise<void>;
    deleteExpired(): Promise<void>;

    exists(token: string): Promise<boolean>;
}

export const REFRESH_TOKEN_REPOSITORY = Symbol('REFRESH_TOKEN_REPOSITORY');
