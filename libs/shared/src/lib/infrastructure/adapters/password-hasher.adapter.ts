import { Injectable } from "@nestjs/common";
import { IPasswordHasher } from "../../domain";
import bcrypt from 'bcryptjs';

@Injectable()
export class BcryptPasswordHasher implements IPasswordHasher {
    private readonly SALT_ROUNDS = 12;

    async hash(plainPassword: string): Promise<string> {
        return await bcrypt.hash(plainPassword, this.SALT_ROUNDS);
    }

    async verify(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}
