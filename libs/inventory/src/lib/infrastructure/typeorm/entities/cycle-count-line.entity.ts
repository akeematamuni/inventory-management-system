import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { CycleCountEntityTypeOrm } from "./cycle-count.entity";

@Entity('cycle_count_lines')
export class CycleCountLineEntityTypeOrm {
    @PrimaryColumn('uuid')
    id!: string;

    @Column({ name: 'product_id', type: 'uuid' })
    productId!: string;

    @Column({ name: 'cycle_count_id', type: 'uuid' })
    cycleCountId!: string;

    @Column({ name: 'system_quantity', type: 'int' })
    systemQuantity!: number;

    @Column({ name: 'counted_quantity', type: 'int', nullable: true })
    countedQuantity!: number | null;

    @ManyToOne(() => CycleCountEntityTypeOrm, x => x.lines)
    @JoinColumn({ name: 'cycle_count_id' })
    cycleCount!: CycleCountEntityTypeOrm;
}
