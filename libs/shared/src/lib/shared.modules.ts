import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { PASSWORD_HASHER, TOKEN_GENERATOR, EMAIL_SENDER } from "./domain";
import { BcryptPasswordHasher, JwtTokenGenerator, EmailSender } from "./infrastructure";

@Module({
    imports: [JwtModule.register({})],
    providers: [
        { provide: PASSWORD_HASHER, useClass: BcryptPasswordHasher },
        { provide: TOKEN_GENERATOR, useClass: JwtTokenGenerator },
        { provide: EMAIL_SENDER, useClass: EmailSender },
    ],
    exports: [
        PASSWORD_HASHER,
        TOKEN_GENERATOR,
        EMAIL_SENDER
    ]
})
export class SharedModule {}
