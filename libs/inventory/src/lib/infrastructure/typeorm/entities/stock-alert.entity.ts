import { Entity, Column, PrimaryColumn, CreateDateColumn, Index } from 'typeorm';
import { StockAlertStatus } from '../../../domain';

@Entity('stock_alerts')
export class StockAlertEntityTypeOrm {
    @PrimaryColumn('uuid')
    id!: string;

    @Index()
    @Column({ name: 'product_id', type: 'uuid' })
    productId!: string;

    @Index()
    @Column({ name: 'warehouse_id', type: 'uuid' })
    warehouseId!: string;

    @Column({ name: 'current_balance', type: 'int' })
    currentBalance!: number;

    @Column({ name: 'reorder_point', type: 'int' })
    reorderPoint!: number;

    @Index()
    @Column({ type: 'enum', enum: StockAlertStatus })
    status!: StockAlertStatus;

    @Column({ name: 'resolved_at', type: 'timestamp', nullable: true })
    resolvedAt?: Date | null;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt!: Date;
}
