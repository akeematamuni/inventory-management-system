import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('warehouses')
export class WarehouseEntityTypeOrm {
    @PrimaryColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 50 })
    name!: string;

    @Index()
    @Column({ type: 'varchar', length: 10, unique: true })
    code!: string;

    @Column({ type: 'text', nullable: true })
    address?: string | null;
    
    @Column({ name: 'is_active', type: 'boolean', default: true })
    isActive!: boolean;
    
    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt!: Date;
    
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt!: Date;
}
