import { Entity, Column, PrimaryColumn, Index, CreateDateColumn, OneToMany, UpdateDateColumn } from 'typeorm';
import { PurchaseOrderStatus } from '../../../domain';
import { PurchaseOrderLineEntityTypeOrm } from './purchase-order-line.entity';

@Entity('purchase_orders')
export class PurchaseOrderEntityTypeOrm {
    @PrimaryColumn('uuid')
    id!: string;

    @Index()
    @Column({ name: 'warehouse_id', type: 'uuid' })
    warehouseId!: string;

    @Column({ name: 'supplier_name', type: 'varchar', length: 150 })
    supplierName!: string;

    @Index()
    @Column({ type: 'enum', enum: PurchaseOrderStatus })
    status!: PurchaseOrderStatus;

    @Column({ type: 'text', nullable: true })
    notes?: string | null;

    @Column({ name: 'created_by', type: 'uuid'})
    createdBy!: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt!: Date;

    @OneToMany(() => PurchaseOrderLineEntityTypeOrm, y => y.purchaseOrder, { cascade: true, eager: false } )
    lines!: PurchaseOrderLineEntityTypeOrm[];
}
