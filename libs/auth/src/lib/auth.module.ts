import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { REFRESH_TOKEN_REPOSITORY } from './domain';
import { LoginService, RefreshTokenService, RegisterService } from './application';
import { RefreshTokenEntityTypeOrm, RefreshTokenRepositoryTypeOrm } from './infrastructure';
import { AuthController } from './presentation';
import { SharedModule } from '@inventory/shared';
import { UserModule } from '@inventory/user';

@Module({
    imports: [
        SharedModule,
        UserModule,
        TypeOrmModule.forFeature([RefreshTokenEntityTypeOrm])
    ],
    controllers: [AuthController],
    providers: [
        { provide: REFRESH_TOKEN_REPOSITORY, useClass: RefreshTokenRepositoryTypeOrm },
        { provide: RegisterService, useClass: RegisterService },
        { provide: RefreshTokenService, useClass: RefreshTokenService },
        { provide: LoginService, useClass: LoginService },
    ]
})
export class AuthModule {}
