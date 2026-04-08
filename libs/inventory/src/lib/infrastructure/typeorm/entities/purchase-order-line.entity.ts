import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import type { PurchaseOrderEntityTypeOrm } from './purchase-order.entity';

@Entity('purchase_order_lines')
export class PurchaseOrderLineEntityTypeOrm {
    @PrimaryColumn('uuid')
    id!: string;

    @Column({ name: 'product_id', type: 'uuid' })
    productId!: string;

    @Column({ name: 'unit_cost_at_order', type: 'decimal', precision: 15, scale: 4 })
    unitCostAtOrder!: number;

    @Column({ name: 'quantity_ordered', type: 'int', })
    quantityOrdered!: number;

    @Column({ name: 'quantity_recieved', type: 'int', default: 0 })
    quantityRecieved!: number;

    @Column({ type: 'varchar', length: 3, default: 'USD' })
    currency!: string;

    @Column({ name: 'purchase_order_id', type: 'uuid' })
    purchaseOrderId!: string;

    @ManyToOne('PurchaseOrderEntityTypeOrm', (x: PurchaseOrderEntityTypeOrm) => x.lines)
    @JoinColumn({ name: 'purchase_order_id' })
    purchaseOrder!: PurchaseOrderEntityTypeOrm
}
