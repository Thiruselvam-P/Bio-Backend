import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
    constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) { }

    async create(createProductDto: CreateProductDto): Promise<ProductDocument> {
        const createdProduct = new this.productModel(createProductDto);
        return createdProduct.save();
    }

    async findAll(search?: string, category?: string): Promise<ProductDocument[]> {
        const query: any = {};
        if (search) {
            query.productName = { $regex: search, $options: 'i' };
        }
        if (category) {
            query.category = { $regex: category, $options: 'i' };
        }
        return this.productModel.find(query).exec();
    }

    async findOne(id: string): Promise<ProductDocument> {
        let product;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            product = await this.productModel.findById(id).exec();
        } else {
            // Fallback to finding by name if it's not a valid ObjectId
            product = await this.productModel.findOne({ productName: id }).exec();
        }

        if (!product) {
            throw new NotFoundException(`Product with ID or Name "${id}" not found`);
        }
        return product;
    }

    async update(id: string, updateProductDto: UpdateProductDto): Promise<ProductDocument> {
        const updatedProduct = await this.productModel
            .findByIdAndUpdate(id, updateProductDto, { new: true })
            .exec();
        if (!updatedProduct) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return updatedProduct;
    }

    async remove(id: string): Promise<void> {
        const result = await this.productModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
    }
}
