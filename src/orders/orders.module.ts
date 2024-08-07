import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderService } from "./orders.service";
import { Order } from "./OrderEntity/orders.entity";
import { OrdersController } from "./orders.controller";
import { User } from "../users/UserEntity/users.entity";
import { ProductsModule } from "../products/products.module";
import { Product } from "../products/ProductEntity/products.entity";
import { OrderDetail } from "../orderDetail/OrderDetailEntity/orderDetail.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Order, OrderDetail, Product,User]),
        ProductsModule],
    providers: [OrderService],
    controllers: [OrdersController],
})

export class OrderModule{}