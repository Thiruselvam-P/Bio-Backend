import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const usersService = app.get(UsersService);

    // Admin User
    const adminEmail = 'admin@mjfresh.com';
    const existingAdmin = await usersService.findByEmail(adminEmail);

    if (!existingAdmin) {
        console.log('Creating admin user...');
        await usersService.create({
            name: 'Admin User',
            email: adminEmail,
            password: 'adminpassword123',
            phone: '1234567890',
            role: 'ADMIN'
        });
        console.log('Admin user created successfully.');
    } else {
        console.log('Admin user already exists.');
    }

    // Regular User
    const userEmail = 'user@mjfresh.com';
    const existingUser = await usersService.findByEmail(userEmail);

    if (!existingUser) {
        console.log('Creating regular user...');
        await usersService.create({
            name: 'Regular User',
            email: userEmail,
            password: 'userpassword123',
            phone: '9876543210',
            role: 'USER'
        });
        console.log('Regular user created successfully.');
    } else {
        console.log('Regular user already exists.');
    }

    await app.close();
}
bootstrap();
