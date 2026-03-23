import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ collection: 'products', timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class ProductEntityMongo {
    @Prop({ required: true, unique: true })
    _id!: string;

    @Prop({ required: true })

    @Prop({ required: true, unique: true, index: true })
    sku!: string;

    @Prop({ default: null })
    description?: string | null;

    @Prop({ required: true, type: Number, default: 0 })
    unitCost!: number;

    @Prop({ required: true, default: 'USD' })
    currency!: string;

    @Prop({ unique: true, sparse: true, default: null })
    barcode?: string | null;

    @Prop({ required: true, default: true })
    isActive!: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(ProductEntityMongo);

export type ProductDocument = ProductEntityMongo & Document;
