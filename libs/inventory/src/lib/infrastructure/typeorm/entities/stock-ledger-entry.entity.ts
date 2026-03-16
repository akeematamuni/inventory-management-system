import { Entity, Column, PrimaryColumn, Index, CreateDateColumn } from 'typeorm';
import { MovementType } from '../../../domain';

@Entity('stock_ledger_entry')
export class StockLedgerEntryEntityTypeOrm {
    @PrimaryColumn('uuid')
    id!: string;

    @Index()
    @Column({ name: 'product_id', type: 'uuid' })
    productId!: string;

    @Index()
    @Column({ name: 'warehouse_id', type: 'uuid' })
    warehouseId!: string;

    @Index()
    @Column({ name: 'movement_type', type: 'enum', enum: MovementType })
    movementType!: MovementType;

    @Column({ name: 'quantity_change', type: 'int' })
    quantityChange!: number;

    @Column({ name: 'balance_after', type: 'int' })
    balanceAfter!: number;

    @Column({ name: 'reference_id', type: 'uuid' })
    referenceId!: string;

    @Column({ name: 'reference_type', type: 'varchar', length: 50 })
    referenceType!: string;

    @Column({ name: 'performed_by', type: 'uuid' })
    performedBy!: string;

    @Column({ type: 'text', nullable: true })
    notes?: string | null;

    @CreateDateColumn({ name: 'occurred_at', type: 'timestamp' })
    occurredAt!: Date;
}
