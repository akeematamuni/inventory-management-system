import { Injectable, Inject } from "@nestjs/common";
import { Email, User, UserNotFoundException, IUserRepository, USER_REPOSITORY } from "../../domain";

@Injectable()
export class GetUserByEmailService {
    constructor(@Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository) {}

    async execute(email: string): Promise<User> {
        const emailObj = Email.create(email);
        const user = await this.userRepo.findByEmail(emailObj);
        if (!user) throw new UserNotFoundException(email);
        return user;
    }
}
