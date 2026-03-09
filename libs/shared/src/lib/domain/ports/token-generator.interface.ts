import { TokenPayload } from "../value-objects/token-payload.vo";

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export type TokenType = 'access' | 'refresh';

export interface ITokenGenerator {
    generateAccessToken(payload: TokenPayload): Promise<string>;
    generateRefreshToken(userId: string): Promise<string>;
    generateTokenPair(payload: TokenPayload): Promise<TokenPair>;
    verifyToken(token: string, type?:TokenType ): Promise<TokenPayload | { userId: string }>;
    decodeToken(token: string): TokenPayload | null;
}

export const TOKEN_GENERATOR = Symbol('TOKEN_GENERATOR');
