import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getModelToken } from '@nestjs/mongoose';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const productModel = app.get(getModelToken('Product'));
    const count = await productModel.countDocuments();
    console.log(`DB_REPORT:PRODUCTS:${count}`);

    const userModel = app.get(getModelToken('User'));
    const uCount = await userModel.countDocuments();
    console.log(`DB_REPORT:USERS:${uCount}`);

    const orderModel = app.get(getModelToken('Order'));
    const oCount = await orderModel.countDocuments();
    console.log(`DB_REPORT:ORDERS:${oCount}`);

    await app.close();
}
bootstrap();
