import { Controller, Post, Inject } from "@nestjs/common";
import { LoginDto } from "../dtos/login.dto";
import { RegisterDto } from "../dtos/register.dto";
import { RefreshTokenDto } from "../dtos/refresh-token.dto";
import { RegisterService, LoginService, RefreshTokenService } from '../../application';
import { Public, ManualBody } from "@inventory/core/decorators";

@Public()
@Controller('auth')
export class AuthController {
    constructor(
        @Inject(RegisterService) private readonly registerService: RegisterService,
        @Inject(RefreshTokenService) private readonly refreshTokenService: RefreshTokenService,
        @Inject(LoginService) private readonly loginService: LoginService
    ) {}

    @Post('/login')
    async login(@ManualBody(LoginDto) dto: LoginDto) {
        return await this.loginService.execute(dto);
    }

    @Post('/refresh')
    async refresh(@ManualBody(RefreshTokenDto) dto: RefreshTokenDto) {
        return await this.refreshTokenService.execute(dto.refreshToken);
    }

    @Post('/register')
    async registerTenant(@ManualBody(RegisterDto) dto: RegisterDto) {
        return await this.registerService.execute(dto);
    }
}
