import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity('product_settings')
export class ProductSettingsEntityTypeOrm {
    @PrimaryColumn('uuid')
    id!: string;

    @Column({ name: 'reorder_point', type: 'int', default: 0 })
    reorderPoint!: number;

    @Column({ name: 'is_active', type: 'boolean', default: true })
    isActive!: boolean;
}
