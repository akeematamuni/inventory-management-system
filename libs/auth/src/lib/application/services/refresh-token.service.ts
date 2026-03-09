import { Inject, Injectable } from '@nestjs/common';
import { LoginResponse } from '../dtos/auth.dto';
import { TOKEN_GENERATOR, ITokenGenerator, TokenPayload } from '@inventory/shared/domain';
import { GetUserByIdService } from '@inventory/user/application';
import { 
    IRefreshTokenRepository, InvalidTokenException, 
    TokenExpiredException, RefreshTokenEntity, REFRESH_TOKEN_REPOSITORY
} from '../../domain';

@Injectable()
export class RefreshTokenService {

    constructor(
        @Inject(TOKEN_GENERATOR) private readonly tokenGenerator: ITokenGenerator,
        @Inject(REFRESH_TOKEN_REPOSITORY) private readonly refreshTokenRepo: IRefreshTokenRepository,
        @Inject(GetUserByIdService) private readonly getUserByIdService: GetUserByIdService
    ) {}

    async execute(refreshToken: string): Promise<LoginResponse> {
        await this.tokenGenerator.verifyToken(refreshToken, 'refresh');

        const refreshTokenEntity = await this.refreshTokenRepo.findByToken(refreshToken);

        if (!refreshTokenEntity) throw new InvalidTokenException('Refresh token not found');
        if (!refreshTokenEntity.isValid()) throw new TokenExpiredException();

        const user = await this.getUserByIdService.execute(refreshTokenEntity.userId);

        refreshTokenEntity.revoke();
        await this.refreshTokenRepo.save(refreshTokenEntity);

        const tokenPayload = TokenPayload.create({userId: user.id, email: user.email.value});
        const { accessToken, refreshToken: newRefreshToken } = await this.tokenGenerator.generateTokenPair(tokenPayload);

        const newRefreshTokenEntity = RefreshTokenEntity.create({
            refreshToken: newRefreshToken,
            userId: user.id
        });

        await this.refreshTokenRepo.save(newRefreshTokenEntity);
        return { accessToken, refreshToken: newRefreshToken };
    }
}
