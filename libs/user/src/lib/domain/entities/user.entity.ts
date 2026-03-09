import { Email } from '../value-objects/email.vo';
import { PasswordHash } from "../value-objects/password-hash.vo";

import { Entity, BaseId } from "@inventory/core/domain";

export interface UserProps {
    firstName?: string | null;
    lastName?: string | null;
    email: Email;
    passwordHash: PasswordHash;
    emailVerified: boolean
    verificationToken?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateUserProps {
    firstName?: string;
    lastName?: string;
    email: Email;
    passwordHash: PasswordHash;
}

export class User extends Entity<UserProps> {
    private constructor(props: UserProps, id: string) {
        super(props, id);
    }

    public static create(props: CreateUserProps): User {
        const now = new Date();
        const verificationToken = BaseId.generate().value;

        return new User(
            {
                ...props,
                emailVerified: false,
                verificationToken,
                createdAt: now,
                updatedAt: now
            },
            BaseId.generate().value
        );
    }

    public static reconstitute(props: UserProps, id: string): User {
        return new User(props, id);
    }

    public verifyEmail(token: string): void {
        if (this.emailVerified) {
            throw new Error('Email already verified');
        }

        if (this.verificationToken !== token) {
            throw new Error('Invalid verification token');
        }

        this.props.emailVerified = true;
        this.props.verificationToken = undefined;
        this.props.updatedAt = new Date();
    }

    public updatePassword(newPasswordHash: PasswordHash): void {
        this.props.passwordHash = newPasswordHash;
        this.props.updatedAt = new Date();
    }


    public updateProfile(newFirstName?: string, newLastName?: string): void {
        if (newFirstName) {
            this.props.firstName = newFirstName
        }
        if (newLastName) {
            this.props.lastName = newLastName;
        }
        this.props.updatedAt = new Date();
    }

    /* Getters */
    get firstName(): string | null | undefined {
        return this.props.firstName;
    }

    get lastName(): string | null | undefined {
        return this.props.lastName;
    }

    get email(): Email {
        return this.props.email;
    }

    get fullname(): string {
        if (this.firstName && this.lastName) {
            return `${this.firstName} ${this.lastName}`;
        }

        return this.firstName || this.lastName || this.email.value;
    }

    get passwordHash(): PasswordHash {
        return this.props.passwordHash;
    }

    get emailVerified(): boolean {
        return this.props.emailVerified;
    }

    get verificationToken(): string | null | undefined {
        return this.props.verificationToken;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }
}
