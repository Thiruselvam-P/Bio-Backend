import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true })
    password: string;

    @Prop({ default: 'USER', enum: ['ADMIN', 'USER'] })
    role: string;

    @Prop()
    resetToken?: string;

    @Prop()
    resetTokenExpiry?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
