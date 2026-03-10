import { Injectable, Inject } from "@nestjs/common";
import { RegisterDTO } from "../dtos/auth.dto";
import { ITokenGenerator, TokenPayload, TOKEN_GENERATOR } from "@inventory/shared/domain";
import { Email } from '@inventory/user/domain';
import { CreateUserService, UserExistService } from "@inventory/user/application";
import {
    EmailAlreadyRegisteredException, RefreshTokenEntity, REFRESH_TOKEN_REPOSITORY, IRefreshTokenRepository
} from '../../domain'

@Injectable()
export class RegisterService {
    constructor(
        @Inject(TOKEN_GENERATOR) private readonly tokenGenerator: ITokenGenerator,
        @Inject(REFRESH_TOKEN_REPOSITORY) private readonly refreshTokenRepo: IRefreshTokenRepository,
        @Inject(CreateUserService) private readonly createUserService: CreateUserService,
        @Inject(UserExistService) private readonly userExistService: UserExistService
    ) {}

    async execute(dto: RegisterDTO) {
        /** Use domain rules to ensure data integrity */
        const email = Email.create(dto.email).value;
       
        /* Check for email availability */
        const emailExists = await this.userExistService.execute(email);
        if (emailExists) {
            throw new EmailAlreadyRegisteredException(email);
        }

        const adminUser = await this.createUserService.execute(
            {
                firstName: dto.firstName, 
                lastName: dto.lastName, 
                email: dto.email, 
                password: dto.password
            }
        );

        /* Create a token payload (used for access and refresh tokens) */
        const tokenPayload = TokenPayload.create({
            userId: adminUser.id,
            email: adminUser.email.value
        });

        /* Generate access and refresh token */
        const { accessToken, refreshToken } = await this.tokenGenerator.generateTokenPair(tokenPayload);

        const refreshTokenEntity = RefreshTokenEntity.create({
            refreshToken,
            userId: adminUser.id
        });

        await this.refreshTokenRepo.save(refreshTokenEntity);

        return {
            accessToken, 
            refreshToken, 
            user: {
                firstName: adminUser.firstName,
                lastName: adminUser.lastName,
                email: adminUser.email.value,
                emailVerified: adminUser.emailVerified
            }
        };

    }
}
