import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const usersService = app.get(UsersService);

    const adminEmail = 'admin@mjfresh.com';
    const existingAdmin = await usersService.findByEmail(adminEmail);

    if (!existingAdmin) {
        console.log('Creating admin user...');
        await usersService.create({
            name: 'Admin',
            email: adminEmail,
            password: 'adminpassword123',
            phone: '1234567890',
            role: 'ADMIN'
        });
        console.log('Admin user created successfully.');
    } else {
        console.log('Admin user already exists.');
    }

    await app.close();
}
bootstrap();
