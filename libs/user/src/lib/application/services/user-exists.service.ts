import { Injectable, Inject } from "@nestjs/common";
import { Email, IUserRepository, USER_REPOSITORY } from "../../domain";

@Injectable()
export class UserExistService {
    constructor(@Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository) {}

    async execute(email: string): Promise<boolean> {
        const emailObj = Email.create(email);
        return await this.userRepo.emailExists(emailObj);
    }
}
