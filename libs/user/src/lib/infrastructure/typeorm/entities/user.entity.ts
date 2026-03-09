import { Entity, Column, PrimaryColumn, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class UserEntityTypeOrm {
    @PrimaryColumn('uuid')
    id!: string;

    @Column({ name: 'first_name', type: 'varchar', length: 100, nullable: true })
    firstName?: string | null;

    @Column({ name: 'last_name', type: 'varchar', length: 100, nullable: true })
    lastName?: string | null;

    @Index()
    @Column({ type: 'varchar', length: 255, unique: true })
    email!: string;

    @Column({ name: 'password_hash', type: 'varchar', length: 60 })
    passwordHash!: string;

    @Column({ name:'email_verified', type: 'boolean', default: false })
    emailVerified!: boolean;

    @Column({ name: 'verification_token', type: 'varchar', length: 255, nullable: true })
    verificationToken?: string | null;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt!: Date;
}
