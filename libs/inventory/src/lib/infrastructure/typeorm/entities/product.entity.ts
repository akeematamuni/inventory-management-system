import { Entity, Column, PrimaryColumn, Index, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('products')
export class ProductEntityTypeOrm {
    @PrimaryColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 100 })
    name!: string;

    @Index()
    @Column({ type: 'varchar', length: 20, unique: true})
    sku!: string;

    @Column({ type: 'text', nullable: true})
    description?: string | null;

    @Column({ name: 'unit_cost', type: 'decimal', precision: 15, scale: 4, default: 0 })
    unitCost!: string;

    @Column({ type: 'varchar', length: 3, default: 'USD' })
    currency!: string;

    @Column({ name: 'reorder_point', type: 'int', default: 0 })
    reorderPoint!: number;

    @Column({ type: 'varchar', length: 150, unique: true, nullable: true })
    barcode?: string | null;

    @Column({ name: 'is_active', type: 'boolean', default: true })
    isActive!: boolean

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt!: Date;
    
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt!: Date;
}
