import {
    Controller,
    Get,
    Post,
    Put,
    Body,
    Param,
    UseGuards,
    Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    @Roles('USER', 'ADMIN')
    async create(@Request() req, @Body() createOrderDto: CreateOrderDto) {
        return this.ordersService.create(req.user.userId, createOrderDto);
    }

    @Get('my-orders')
    @Roles('USER', 'ADMIN')
    async findMyOrders(@Request() req) {
        return this.ordersService.findMyOrders(req.user.userId);
    }

    @Get()
    @Roles('ADMIN')
    async findAll() {
        return this.ordersService.findAll();
    }

    @Get('summary')
    @Roles('ADMIN')
    async getSalesSummary() {
        return this.ordersService.getSalesSummary();
    }

    @Get('report/:date')
    @Roles('ADMIN')
    async getSalesReport(@Param('date') date: string) {
        return this.ordersService.getSalesByDate(date);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.ordersService.findOne(id);
    }

    @Put(':id/status')
    @Roles('ADMIN')
    async updateStatus(
        @Param('id') id: string,
        @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    ) {
        return this.ordersService.updateStatus(id, updateOrderStatusDto);
    }
}
