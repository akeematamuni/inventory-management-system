import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { USER_REPOSITORY } from './domain';
import { CreateUserService, GetUserByEmailService, GetUserByIdService } from './application';
import { UserRepositoryTypeOrm } from './infrastructure';
import { UserEntityTypeOrm } from './infrastructure/typeorm/entities/user.entity';
import { SharedModule } from '@inventory/shared';

/** Wire up modules, providers, and controller */

@Module({
    imports: [
        SharedModule,
        TypeOrmModule.forFeature([UserEntityTypeOrm])
    ],
    providers: [
        { provide: USER_REPOSITORY, useClass: UserRepositoryTypeOrm },
        { provide: CreateUserService, useClass: CreateUserService },
        { provide: GetUserByEmailService, useClass: GetUserByEmailService },
        { provide: GetUserByIdService, useClass: GetUserByIdService }
    ],
    exports: [
        CreateUserService,
        GetUserByEmailService,
        GetUserByIdService
    ],
})
export class UserModule {}
