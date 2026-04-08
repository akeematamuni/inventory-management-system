import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import type { CycleCountLineEntityTypeOrm } from "./cycle-count-line.entity";
import { CycleCountStatus } from "../../../domain";

@Entity('cycle_counts')
export class CycleCountEntityTypeOrm {
    @PrimaryColumn('uuid')
    id!: string;

    @Column({ name: 'warehouse_id', type: 'uuid' })
    warehouseId!: string;

    @Column({ type: 'enum', enum: CycleCountStatus })
    status!: CycleCountStatus;

    @Column({ name: 'created_by', type: 'uuid' })
    createdBy!: string;

    @Column({ name: 'approved_by', type: 'uuid', nullable: true })
    approvedBy?: string | null;

    @Column({ type: 'text', nullable: true })
    notes?: string | null;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt!: Date;
    
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt!: Date;

    @OneToMany(
        'CycleCountLineEntityTypeOrm', 
        (y: CycleCountLineEntityTypeOrm) => y.cycleCount, 
        { cascade: true, eager: false }
    )
    lines!: CycleCountLineEntityTypeOrm[];
}
