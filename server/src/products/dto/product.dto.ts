import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    productName: string;

    @IsString()
    @IsNotEmpty()
    category: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsBoolean()
    @IsOptional()
    availability?: boolean;

    @IsString()
    @IsOptional()
    imageUrl?: string;
}

export class UpdateProductDto {
    @IsString()
    @IsOptional()
    productName?: string;

    @IsString()
    @IsOptional()
    category?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsOptional()
    price?: number;

    @IsBoolean()
    @IsOptional()
    availability?: boolean;

    @IsString()
    @IsOptional()
    imageUrl?: string;
}
