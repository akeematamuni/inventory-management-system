import { User, PasswordHash, Email } from '../../../domain';
import { UserEntityTypeOrm } from '../entities/user.entity';

export class UserMapper {
    public static toDomain(raw: UserEntityTypeOrm): User {
        return User.reconstitute(
            {
                email: Email.create(raw.email),
                passwordHash: PasswordHash.create(raw.passwordHash),
                firstName: raw.firstName,
                lastName: raw.lastName,
                emailVerified: raw.emailVerified,
                verificationToken: raw.verificationToken,
                createdAt: raw.createdAt,
                updatedAt: raw.updatedAt
            },
            raw.id
        );
    }

    public static toPersistence(domain: User): UserEntityTypeOrm {
        const entity = new UserEntityTypeOrm();
        entity.id = domain.id;
        entity.email = domain.email.value;
        entity.passwordHash = domain.passwordHash.value;
        entity.firstName = domain.firstName;
        entity.lastName = domain.lastName;
        entity.emailVerified = domain.emailVerified;
        entity.verificationToken = domain.verificationToken;
        entity.createdAt = domain.createdAt;
        entity.updatedAt = domain.updatedAt;
        return entity;
    }
}
