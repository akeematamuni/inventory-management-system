import { Entity, PrimaryColumn, Column, Index, CreateDateColumn } from "typeorm";
import { MovementType, AdjustmentReasonCode } from "../../../domain";

@Entity('adjustments')
export class AdjustmentEntityTypeOrm {
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
    movementType!: MovementType.ADJUSTMENT_UP | MovementType.ADJUSTMENT_DOWN;

    @Column({ type: 'int' })
    quantity!: number;

    @Column({ name: 'reason_code', type: 'enum', enum: AdjustmentReasonCode})
    reasonCode!: AdjustmentReasonCode;

    @Column({ name: 'reason_notes', type: 'text', nullable: true })
    reasonNotes?: string;

    @Column({ type: 'text', nullable: true })
    notes?: string | null;

    @Column({ name: 'created_by', type: 'uuid' })
    createdBy!: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt!: Date;
}
