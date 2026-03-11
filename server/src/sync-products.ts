import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ProductsService } from './products/products.service';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const productsService = app.get(ProductsService);

    const productsDir = path.join(process.cwd(), 'uploads', 'products');
    if (!fs.existsSync(productsDir)) {
        console.log('Uploads directory not found.');
        await app.close();
        return;
    }

    const files = fs.readdirSync(productsDir);
    console.log(`Found ${files.length} files in uploads/products.`);

    const existingProducts = await productsService.findAll();
    const existingImages = new Set(existingProducts.map(p => p.imageUrl));

    let createdCount = 0;
    for (const file of files) {
        const imageUrl = `products/${file}`;
        if (!existingImages.has(imageUrl)) {
            console.log(`Restoring product for image: ${file}`);
            try {
                // Generate a name from the filename or a placeholder
                const date = new Date(parseInt(file.split('-')[0]));
                const dateStr = !isNaN(date.getTime()) ? date.toLocaleDateString() : 'New';

                await productsService.create({
                    productName: `New Product ${dateStr} (${file.split('-')[1]?.split('.')[0] || '1'})`,
                    category: 'Uncategorized',
                    description: 'Automatically restored from existing image file.',
                    price: 0,
                    availability: true,
                    imageUrl: imageUrl
                });
                createdCount++;
            } catch (err) {
                console.error(`Failed for ${file}:`, err.message);
            }
        }
    }

    console.log(`Successfully restored ${createdCount} products!`);
    await app.close();
}
bootstrap();
