import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
    @Prop({ required: true })
    productName: string;

    @Prop({ required: true })
    category: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    price: number;

    @Prop({ default: true })
    availability: boolean;

    @Prop()
    imageUrl: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
