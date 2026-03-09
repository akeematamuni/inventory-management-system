import { Injectable, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

import { 
    ITokenGenerator, TokenPair, TokenPayload, 
    TokenType, TokenExpiredException, InvalidTokenException 
} from "../../domain";
import { parseDurationToSeconds } from "../utils/parse-duration.util";

/* Token generator adapter, using jwt token for authentication */

@Injectable()
export class JwtTokenGenerator implements ITokenGenerator {
    private readonly JWT_EXPIRES: string;
    private readonly JWT_SECRET: string;
    private readonly JWT_REFRESH_EXPIRES: string;
    private readonly JWT_REFRESH_SECRET: string;

    constructor(
        @Inject(JwtService) private readonly jwtService: JwtService,
        @Inject(ConfigService) private readonly configService: ConfigService
    ) {
        this.JWT_EXPIRES = this.configService.get('JWT_EXPIRES') as string;
        this.JWT_SECRET = this.configService.get('JWT_SECRET') as string;
        this.JWT_REFRESH_EXPIRES = this.configService.get('JWT_REFRESH_EXPIRES') as string;
        this.JWT_REFRESH_SECRET = this.configService.get('JWT_REFRESH_SECRET') as string;
    }

    async generateAccessToken(payload: TokenPayload): Promise<string> {
        const expiresIn = parseDurationToSeconds(this.JWT_EXPIRES);
        return await this.jwtService.signAsync(
            payload.toPlainObject(), 
            { secret: this.JWT_SECRET, expiresIn }
        );
    }
    
    async generateRefreshToken(userId: string): Promise<string> {
        const expiresIn = parseDurationToSeconds(this.JWT_REFRESH_EXPIRES);
        return await this.jwtService.signAsync(
            { userId }, { secret: this.JWT_REFRESH_SECRET, expiresIn }
        );
    }

    async generateTokenPair(payload: TokenPayload): Promise<TokenPair> {
        const expiresIn = parseDurationToSeconds(this.JWT_EXPIRES);
        const accessToken = await this.generateAccessToken(payload);
        const refreshToken = await this.generateRefreshToken(payload.userId);
        return { accessToken, refreshToken, expiresIn };
    }

    /* Verify jwt token accounting for token type */
    async verifyToken(token: string, type?: TokenType): Promise<TokenPayload | { userId: string }> {
        let decoded;

        try {
            if (type === 'refresh') {
                decoded = await this.jwtService.verifyAsync(
                    token, { secret: this.JWT_REFRESH_SECRET }
                );

                return { userId: decoded.userId };

            } else {
                decoded = await this.jwtService.verifyAsync(
                    token, { secret: this.JWT_SECRET }
                );
            }

            return TokenPayload.create({
                userId: decoded.userId,
                email: decoded.email
            });

        /* eslint-disable @typescript-eslint/no-explicit-any */
        } catch (error: any) {
            /* eslint-enable @typescript-eslint/no-explicit-any */
            if (error.name === 'TokenExpiredError') {
                throw new TokenExpiredException();
            }
            const reason = error.message ? error.message : '';
            throw new InvalidTokenException(reason);
        }
    }

    decodeToken(token: string): TokenPayload | null {
        try {
            const decoded = this.jwtService.decode(token);
            if (!decoded) return null;

            return TokenPayload.create({
                userId: decoded.userId,
                email: decoded.email
            });

        } catch {
            return null;
        }
    }
}
