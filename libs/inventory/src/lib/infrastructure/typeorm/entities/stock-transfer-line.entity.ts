import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import type { StockTransferEntityTypeOrm } from './stock-transfer.entity';

@Entity('stock_transfer_lines')
export class StockTransferLineEntityTypeOrm {
    @PrimaryColumn('uuid')
    id!: string;

    @Column({ name: 'product_id', type: 'uuid' })
    productId!: string;

    @Column({ name: 'quantity_requested', type: 'int' })
    quantityRequested!: number;

    @Column({ name: 'quantity_dispatched', type: 'int', default: 0 })
    quantityDispatched!: number;

    @Column({ name: 'quantity_recieved', type: 'int', default: 0 })
    quantityReceived!: number;

    @Column({ name: 'stock_transfer_id', type: 'uuid' })
    stockTransferId!: string;

    @ManyToOne('StockTransferEntityTypeOrm', (x: StockTransferEntityTypeOrm) => x.lines)
    @JoinColumn({ name: 'stock_transfer_id' })
    stockTransfer!: StockTransferEntityTypeOrm
}
