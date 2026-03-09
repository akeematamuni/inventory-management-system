import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LessThan, MoreThan, Repository } from "typeorm";

import { IRefreshTokenRepository, RefreshTokenEntity } from "../../../domain";
import { RefreshTokenEntityTypeOrm } from "../entities/refresh-token.entity";
import { RefreshTokenMapper } from "../mappers/refresh-token.mapper";

@Injectable()
export class RefreshTokenRepositoryTypeOrm implements IRefreshTokenRepository {
    constructor(@InjectRepository(RefreshTokenEntityTypeOrm) private readonly repo: Repository<RefreshTokenEntityTypeOrm>) {}

    async save(refreshToken: RefreshTokenEntity): Promise<RefreshTokenEntity> {
        const entity = RefreshTokenMapper.toPersistence(refreshToken);
        const saved = await this.repo.save(entity);
        return RefreshTokenMapper.toDomain(saved);
    }

    async findByToken(token: string): Promise<RefreshTokenEntity | null> {
        const entity = await this.repo.findOne({ where: { token } });
        return entity ? RefreshTokenMapper.toDomain(entity) : null;
    }

    async findByUserId(userId: string): Promise<RefreshTokenEntity[]> {
        const entities = await this.repo.find({ where: { userId } });
        return entities.map(e => RefreshTokenMapper.toDomain(e));
    }

    async findValidByUserId(userId: string): Promise<RefreshTokenEntity[]> {
        const entities = await this.repo.find({ where: { userId, isRevoked: false, expiresAt: MoreThan(new Date()) } });
        return entities.map(e => RefreshTokenMapper.toDomain(e));
    }

    async revokeByToken(token: string): Promise<void> {
        const entity = await this.repo.findOne({ where: { token } });

        if (entity) {
            const domainEnt = RefreshTokenMapper.toDomain(entity);
            domainEnt.revoke();
            await this.save(domainEnt);
        }
    }

    async revokeAllByUserId(userId: string): Promise<void> {
        const entities = await this.repo.find({ where: { userId, isRevoked: false, expiresAt: MoreThan(new Date()) } });

        entities.map((entity) => {
            const domainEnt = RefreshTokenMapper.toDomain(entity);
            domainEnt.revoke();
        });
        
        await this.repo.save(entities);
    }

    async exists(token: string): Promise<boolean> {
        return await this.repo.count({ where: { token } }) > 0;
    }

    async deleteExpired(): Promise<void> {
        const entities = await this.repo.find({ where: { expiresAt: LessThan(new Date()) } });
        await this.repo.delete(entities);
    }
}
