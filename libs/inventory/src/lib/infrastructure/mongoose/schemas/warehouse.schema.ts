import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'warehouses', timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class WarehouseEntityMongo {
    @Prop({ type: String, required: true, unique: true })
    _id!: string;

    @Prop({ type: String, required: true })
    name!: string;

    @Prop({ type: String, required: true, unique: true, index: true })
    code!: string;

    @Prop({ type: String, default: null })
    address?: string | null;

    @Prop({ type: Boolean ,required: true, default: true })
    isActive!: boolean;

    createdAt!: Date;
    updatedAt!: Date;
}

export const WarehouseSchema = SchemaFactory.createForClass(WarehouseEntityMongo);
export type WarehouseDocument = WarehouseEntityMongo & Omit<Document, '_id'>;
