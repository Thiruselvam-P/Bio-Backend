import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Product } from '../../products/schemas/product.schema';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
    @Prop({ unique: true })
    orderId: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true })
    productId: Types.ObjectId;

    @Prop({ required: true })
    quantity: number;

    @Prop({ required: true })
    totalAmount: number;

    @Prop({ default: 0 })
    gst: number;

    @Prop({ default: 0 })
    deliveryCharge: number;

    @Prop({ default: 'Cash on Delivery' })
    paymentMethod: string;

    @Prop({ default: 'PENDING', enum: ['PENDING', 'SUCCESS', 'FAILED'] })
    paymentStatus: string;

    @Prop({ default: 'Placed', enum: ['Placed', 'Processing', 'Shipped', 'Delivered'] })
    orderStatus: string;

    @Prop()
    shippingAddress: string;

    @Prop()
    couponCode: string;

    @Prop()
    expectedDeliveryDate: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
