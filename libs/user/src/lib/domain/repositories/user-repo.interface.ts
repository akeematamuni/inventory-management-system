import { User } from "../entities/user.entity";
import { Email } from "../value-objects/email.vo";

/** Refactored to allow implementation code have option of using Entity manager */
export interface IUserRepository {
    save(user: User, manager?: unknown): Promise<User>;

    findById(id: string, manager?: unknown): Promise<User | null>;
    findByEmail(email: Email, manager?: unknown): Promise<User | null>;
    
    exists(id: string, manager?: unknown): Promise<boolean>;
    emailExists(email: Email, manager?: unknown): Promise<boolean>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
