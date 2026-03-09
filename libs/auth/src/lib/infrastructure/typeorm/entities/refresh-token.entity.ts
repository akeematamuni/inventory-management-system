import { Entity, Column, Index, CreateDateColumn, PrimaryColumn } from "typeorm";

@Entity('refresh_tokens', { schema: 'public' })
export class RefreshTokenEntityTypeOrm {
    @PrimaryColumn('uuid')
    id!: string;

    @Index()
    @Column({ type: 'varchar', length: 255, unique: true })
    token!: string;

    @Index()
    @Column({ name: 'user_id', type: 'uuid' })
    userId!: string;

    @Column({ name: 'is_revoked', type: 'boolean', default: false })
    isRevoked!: boolean;

    @Column({ name: 'revoked_at', type: 'timestamp', nullable: true })
    revokedAt?: Date;

    @Column({ name: 'expires_at', type: 'timestamp', nullable: true })
    expiresAt?: Date;
    
    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt!: Date;
}
