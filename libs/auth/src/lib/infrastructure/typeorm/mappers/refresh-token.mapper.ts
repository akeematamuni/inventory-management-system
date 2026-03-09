import { RefreshTokenEntity } from "../../../domain";
import { RefreshTokenEntityTypeOrm } from "../entities/refresh-token.entity";

export class RefreshTokenMapper {
    public static toDomain(raw: RefreshTokenEntityTypeOrm): RefreshTokenEntity {
        return RefreshTokenEntity.reconstitute(
            {
                refreshToken: raw.token,
                userId: raw.userId,
                isRevoked: raw.isRevoked,
                revokedAt: raw.revokedAt,
                createdAt: raw.createdAt,
                expiresAt: raw.expiresAt
            },
            raw.id
        );
    }

    public static toPersistence(domain: RefreshTokenEntity): RefreshTokenEntityTypeOrm {
        const entity = new RefreshTokenEntityTypeOrm();
        entity.id = domain.id;
        entity.token = domain.refreshToken;
        entity.userId = domain.userId;
        entity.isRevoked = domain.isRevoked;
        entity.revokedAt = domain.revokedAt;
        entity.createdAt = domain.createdAt;
        entity.expiresAt = domain.expiresAt;
        return entity;
    }
}
