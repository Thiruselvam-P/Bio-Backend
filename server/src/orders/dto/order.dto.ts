import { IsString, IsNotEmpty, IsNumber, Min, IsOptional } from 'class-validator';

export class CreateOrderDto {
    @IsString()
    @IsNotEmpty()
    productId: string;

    @IsNumber()
    @Min(1)
    quantity: number;

    @IsString()
    @IsNotEmpty()
    shippingAddress: string;

    @IsString()
    @IsOptional()
    couponCode?: string;

    @IsOptional()
    expectedDeliveryDate?: Date;

    @IsString()
    @IsOptional()
    paymentMethod?: string;
}

export class UpdateOrderStatusDto {
    @IsString()
    @IsNotEmpty()
    orderStatus: string;
}
