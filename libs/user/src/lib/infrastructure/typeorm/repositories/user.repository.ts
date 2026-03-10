import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";

import { Email, IUserRepository, User } from "../../../domain";
import { UserEntityTypeOrm } from "../entities/user.entity";
import { UserMapper } from "../mappers/user.mapper";

@Injectable()
export class UserRepositoryTypeOrm implements IUserRepository {
    constructor(@InjectRepository(UserEntityTypeOrm) private readonly repository: Repository<UserEntityTypeOrm>) {}

    async save(user: User, manager?: EntityManager): Promise<User> {
        const repo = manager ? manager.getRepository(UserEntityTypeOrm) : this.repository;
        const entity = UserMapper.toPersistence(user);
        const saved = await repo.save(entity);
        return UserMapper.toDomain(saved);
    }

    async findById(id: string, manager?: EntityManager): Promise<User | null> {
        const repo = manager ? manager.getRepository(UserEntityTypeOrm) : this.repository;
        const entity = await repo.findOne({ where: { id } });
        return entity ? UserMapper.toDomain(entity) : null;
    }

    async findByEmail(email: Email, manager?: EntityManager): Promise<User | null> {
        const repo = manager ? manager.getRepository(UserEntityTypeOrm) : this.repository;
        const entity = await repo.findOne({ where: { email: email.value } });
        return entity ? UserMapper.toDomain(entity) : null;
    }

    async exists(id: string, manager?: EntityManager): Promise<boolean> {
        const repo = manager ? manager.getRepository(UserEntityTypeOrm) : this.repository;
        return await repo.count({ where: { id } }) > 0;
    }

    async emailExists(email: Email, manager?: EntityManager): Promise<boolean> {
        const repo = manager ? manager.getRepository(UserEntityTypeOrm) : this.repository;
        return await repo.count({ where: { email: email.value } }) > 0;
    }
}
