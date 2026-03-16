import { Entity, Column, PrimaryColumn, Index, Unique, UpdateDateColumn } from 'typeorm';

@Entity('stock_balances')
@Unique(['productId', 'warehouseId'])
export class StockBalanceEntityTypeOrm {
    @PrimaryColumn('uuid')
    id!: string;

    @Index()
    @Column({ name: 'product_id', type: 'uuid' })
    productId!: string;

    @Index()
    @Column({ name: 'warehouse_id', type: 'uuid' })
    warehouseId!: string;

    @Column({ type: 'int', default: 0 })
    quantity!: number;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt!: Date;
}
