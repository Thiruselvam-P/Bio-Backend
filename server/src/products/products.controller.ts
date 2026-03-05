import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get()
    async findAll(@Query('search') search?: string, @Query('category') category?: string) {
        return this.productsService.findAll(search, category);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './uploads/products',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
            },
        }),
    }))
    async create(
        @Body() createProductDto: any,
        @UploadedFile() file: Express.Multer.File
    ) {
        if (file) {
            createProductDto.imageUrl = `products/${file.filename}`;
        }
        // Transform price and availability which might come as strings from FormData
        if (createProductDto.price) createProductDto.price = Number(createProductDto.price);
        if (createProductDto.availability) createProductDto.availability = createProductDto.availability === 'true';

        return this.productsService.create(createProductDto);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './uploads/products',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
            },
        }),
    }))
    async update(
        @Param('id') id: string,
        @Body() updateProductDto: any,
        @UploadedFile() file: Express.Multer.File
    ) {
        if (file) {
            updateProductDto.imageUrl = `products/${file.filename}`;
        }
        if (updateProductDto.price) updateProductDto.price = Number(updateProductDto.price);
        if (updateProductDto.availability) updateProductDto.availability = updateProductDto.availability === 'true';

        return this.productsService.update(id, updateProductDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    async remove(@Param('id') id: string) {
        return this.productsService.remove(id);
    }
}
