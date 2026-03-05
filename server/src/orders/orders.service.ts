import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
        private productsService: ProductsService,
    ) { }

    async create(userId: string, createOrderDto: CreateOrderDto): Promise<OrderDocument> {
        const product = await this.productsService.findOne(createOrderDto.productId);
        const subtotal = product.price * createOrderDto.quantity;
        const gst = Math.round(subtotal * 0.18);
        const deliveryCharge = subtotal > 499 ? 0 : 40;
        const totalAmount = subtotal + gst + deliveryCharge;

        // Generate a random Order ID like ORD_124893
        const orderId = `ORD_${Math.floor(100000 + Math.random() * 900000)}`;

        const createdOrder = new this.orderModel({
            userId,
            ...createOrderDto,
            orderId,
            gst,
            deliveryCharge,
            totalAmount,
            paymentStatus: createOrderDto.paymentMethod === 'Cash on Delivery' ? 'PENDING' : 'SUCCESS',
            orderStatus: 'Placed'
        });
        return createdOrder.save();
    }

    async findAll(): Promise<OrderDocument[]> {
        return this.orderModel.find().populate('userId', 'name email').populate('productId').exec();
    }

    async findMyOrders(userId: string): Promise<OrderDocument[]> {
        return this.orderModel.find({ userId }).populate('productId').exec();
    }

    async updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<OrderDocument> {
        const updatedOrder = await this.orderModel
            .findByIdAndUpdate(id, { orderStatus: updateOrderStatusDto.orderStatus }, { new: true })
            .exec();
        if (!updatedOrder) {
            throw new NotFoundException(`Order with ID ${id} not found`);
        }
        return updatedOrder;
    }

    async getSalesSummary() {
        const orders = await this.orderModel.find().exec();
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        return {
            totalOrders,
            totalRevenue,
        };
    }

    async getSalesByDate(dateStr: string) {
        let year, month, day;
        const [p1, p2, p3] = dateStr.split('-').map(Number);
        if (p1 > 1000) { [year, month, day] = [p1, p2, p3]; }
        else { [day, month, year] = [p1, p2, p3]; }

        const start = new Date(year, month - 1, day, 0, 0, 0, 0);
        const end = new Date(year, month - 1, day, 23, 59, 59, 999);

        const orders = await this.orderModel.find({
            createdAt: { $gte: start, $lte: end }
        }).populate('productId').exec();

        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const totalProducts = orders.reduce((sum, order) => sum + (order.quantity || 0), 0);

        return {
            date: dateStr,
            totalOrders,
            totalRevenue,
            totalProducts,
            orders: orders.map(o => ({
                id: (o as any)._id,
                product: (o.productId as any)?.productName || 'Deleted Product',
                quantity: o.quantity,
                amount: o.totalAmount,
                status: o.orderStatus
            }))
        };
    }
}
