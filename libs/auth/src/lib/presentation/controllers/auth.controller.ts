import { Controller, Post, Inject, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { LoginDto } from "../dtos/login.dto";
import { RegisterDto } from "../dtos/register.dto";
import { RefreshTokenDto } from "../dtos/refresh-token.dto";
import { RegisterService, LoginService, RefreshTokenService, ProfileService } from '../../application';
import { Public, ManualBody, CurrentUserEmail } from "@inventory/core/decorators";
import { AccessDeniedException } from "@inventory/core/errors";

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(
        @Inject(RegisterService) private readonly registerService: RegisterService,
        @Inject(RefreshTokenService) private readonly refreshTokenService: RefreshTokenService,
        @Inject(LoginService) private readonly loginService: LoginService,
        @Inject(ProfileService) private readonly profileService: ProfileService
    ) {}

    @Public()
    @Post('/login')
    @ApiOperation({ summary: 'Login a valid user' })
    async login(@ManualBody(LoginDto) dto: LoginDto) {
        return await this.loginService.execute(dto);
    }
    
    @Public()
    @Post('/refresh')
    @ApiOperation({ summary: 'Get new token set using refresh token' })
    async refresh(@ManualBody(RefreshTokenDto) dto: RefreshTokenDto) {
        return await this.refreshTokenService.execute(dto.refreshToken);
    }

    @Public()
    @Post('/register')
    @ApiOperation({ summary: 'Register a new user' })
    async registerTenant(@ManualBody(RegisterDto) dto: RegisterDto) {
        return await this.registerService.execute(dto);
    }

    @Get('/profile')
    @ApiOperation({ summary: 'Get details of current user' })
    async profile(@CurrentUserEmail() email: string) {
        console.log(email);
        if (!email) throw new AccessDeniedException('You are not valideated');
        return await this.profileService.execute(email);
    }
}
