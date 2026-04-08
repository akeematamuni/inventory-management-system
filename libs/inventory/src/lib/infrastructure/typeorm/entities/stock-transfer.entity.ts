import { Entity, PrimaryColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, Index } from "typeorm";
import type { StockTransferLineEntityTypeOrm } from "./stock-transfer-line.entity";
import { StockTransferStatus } from "../../../domain";

@Entity('stock_transfers')
export class StockTransferEntityTypeOrm {
    @PrimaryColumn('uuid')
    id!: string;

    @Index()
    @Column({ name: 'source_warehouse_id', type: 'uuid' })
    sourceWarehouseId!: string;

    @Index()
    @Column({ name: 'destination_warehouse_id', type: 'uuid' })
    destinationWarehouseId!: string;

    @Index()
    @Column({ name: 'stock_transfer_status', type: 'enum', enum: StockTransferStatus })
    status!: StockTransferStatus;

    @Column({ type: 'text', nullable: true})
    notes?: string | null;

    @Column({ name: 'created_by', type: 'uuid'})
    createdBy!: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt!: Date;

    @OneToMany(
        'StockTransferLineEntityTypeOrm', 
        (y: StockTransferLineEntityTypeOrm) => y.stockTransfer, 
        { cascade: true, eager: false }
    )
    lines!: StockTransferLineEntityTypeOrm[];
}
