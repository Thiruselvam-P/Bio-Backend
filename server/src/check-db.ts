import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);

    const productModel = app.get(getModelToken('Product'));
    const userModel = app.get(getModelToken('User'));
    const orderModel = app.get(getModelToken('Order'));

    const pCount = await productModel.countDocuments();
    const uCount = await userModel.countDocuments();
    const oCount = await orderModel.countDocuments();

    console.log(`Products: ${pCount}`);
    console.log(`Users: ${uCount}`);
    console.log(`Orders: ${oCount}`);

    await app.close();
}
bootstrap();
