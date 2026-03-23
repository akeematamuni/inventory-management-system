import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ collection: 'products', timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class ProductEntityMongo {
    @Prop({ required: true, unique: true })
    _id!: string;

    @Prop({ required: true })
    name!: string;

    @Prop({ required: true, unique: true, index: true })
    sku!: string;

    @Prop({ default: null })
    description?: string | null;

    @Prop({ required: true, type: Number, default: 0 })
    unitCost!: number;

    @Prop({ required: true, type: Number, default: 0 })
    reorderPoint!: number;

    @Prop({ required: true, default: 'USD' })
    currency!: string;

    @Prop({ unique: true, sparse: true, default: null })
    barcode?: string | null;

    @Prop({ required: true, default: true })
    isActive!: boolean;

    createdAt!: Date;
    updatedAt!: Date;
}

export const ProductSchema = SchemaFactory.createForClass(ProductEntityMongo);
export type ProductDocument = ProductEntityMongo & Omit<Document, '_id'>;
