import { Injectable, Inject } from "@nestjs/common";
import { GetUserByEmailService } from "@inventory/user/application";

@Injectable()
export class ProfileService {
    constructor(@Inject(GetUserByEmailService) private readonly getUserByEmailService: GetUserByEmailService) {}

    async execute(email: string) {
        const user = await this.getUserByEmailService.execute(email);
        return {
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email.value,
                emailVerified: user.emailVerified
            }
        }
    }
}
