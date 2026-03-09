import { Injectable, Inject } from "@nestjs/common";
import { EventBus } from "@nestjs/cqrs";
import { LoginDTO, LoginResponse } from "../dtos/auth.dto";
import { PASSWORD_HASHER, TOKEN_GENERATOR, IPasswordHasher, ITokenGenerator, TokenPayload } from "@inventory/shared/domain";
import { InvalidCredentialsException } from '@inventory/user/domain';
import { GetUserByEmailService } from "@inventory/user/application";
import {
    IRefreshTokenRepository, RefreshTokenEntity, UserLoggedInEvent, REFRESH_TOKEN_REPOSITORY 
} from "../../domain";

@Injectable()
export class LoginService {
    constructor(
        @Inject(EventBus) private readonly eventBus: EventBus,
        @Inject(PASSWORD_HASHER) private readonly passwordHasher: IPasswordHasher,
        @Inject(TOKEN_GENERATOR) private readonly tokenGenerator: ITokenGenerator,
        @Inject(REFRESH_TOKEN_REPOSITORY) private readonly refreshTokenRepo: IRefreshTokenRepository,
        @Inject(GetUserByEmailService) private readonly getUserByEmailService: GetUserByEmailService
    ) {}

    async execute(dto: LoginDTO): Promise<LoginResponse> {
        const user = await this.getUserByEmailService.execute(dto.email);
        if (!user) throw new InvalidCredentialsException();

        /** Validate password */
        const validPassword = await this.passwordHasher.verify(dto.password, user.passwordHash.value);
        if (!validPassword) throw new InvalidCredentialsException();

        const tokenPayload = TokenPayload.create({userId: user.id, email: user.email.value});
        const { accessToken, refreshToken } = await this.tokenGenerator.generateTokenPair(tokenPayload);

        const refreshTokenEntity = RefreshTokenEntity.create({
            refreshToken,
            userId: user.id
        });

        await this.refreshTokenRepo.save(refreshTokenEntity);

        this.eventBus.publish(new UserLoggedInEvent(
            user.id, user.email.value, new Date()
        ));

        return { accessToken, refreshToken };
    }
}
