import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

@Schema({ collection: 'products', timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class ProductEntityMongo {
    @Prop({ type:String, required: true })
    _id!: string;

    @Prop({ type:String, required: true })
    name!: string;

    @Prop({ type:String, required: true, unique: true, index: true })
    sku!: string;

    @Prop({ type:String, default: null })
    description?: string | null;

    @Prop({ type: Types.Decimal128, required: true, default: 0 })
    unitCost!: Types.Decimal128;

    @Prop({ type: Number, required: true, default: 0 })
    reorderPoint!: number;

    @Prop({ type:String, required: true, default: 'USD' })
    currency!: string;

    @Prop({ type:String, unique: true, sparse: true, default: null })
    barcode?: string | null;

    @Prop({ type:Boolean, required: true, default: true })
    isActive!: boolean;

    createdAt!: Date;
    updatedAt!: Date;
}

export const ProductSchema = SchemaFactory.createForClass(ProductEntityMongo);
export type ProductDocument = HydratedDocument<ProductEntityMongo>;
