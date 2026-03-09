import { Injectable, Inject } from "@nestjs/common";
import { User, UserNotFoundException, IUserRepository, USER_REPOSITORY } from "../../domain";

@Injectable()
export class GetUserByIdService {
    constructor(@Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository) {}

    async execute(userId: string): Promise<User> {
        const user = await this.userRepo.findById(userId);
        if (!user) throw new UserNotFoundException(userId);
        return user;
    }
}
