import { Injectable, Inject } from "@nestjs/common";
import { CreateUserDTO } from "../dtos/user.dto";
import { User, Email, PasswordHash, IUserRepository, USER_REPOSITORY } from '../../domain';
import { PASSWORD_HASHER, IPasswordHasher } from "@inventory/shared/domain";

/** User must be unique, if a user exists error is thrown. */

@Injectable()
export class CreateUserService {
    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository,
        @Inject(PASSWORD_HASHER) private readonly passwordHasher: IPasswordHasher
    ) {}

    async execute(dto: CreateUserDTO): Promise<User> {
        /** Hash password */
        const hashedPassword = await this.passwordHasher.hash(dto.password);

        const user = User.create({
            firstName: dto.firstName,
            lastName: dto.lastName,
            passwordHash: PasswordHash.create(hashedPassword),
            email: Email.create(dto.email)
        });

        return await this.userRepo.save(user);
    }
}
