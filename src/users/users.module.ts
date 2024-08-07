import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { UserService } from "./users.service";
import { AuthGuard } from "../auth/auth.guard";
import { User } from "./UserEntity/users.entity";
import { RolesGuard } from "../guards/roles.guard";
import { UsersController } from "./users.controller";
import { Order } from "../orders/OrderEntity/orders.entity";
import { ProductsModule } from "../products/products.module";
import { OrderDetail } from "../orderDetail/OrderDetailEntity/orderDetail.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Order, OrderDetail]),
        ProductsModule],
    providers: [UserService, AuthGuard, RolesGuard],
    controllers: [UsersController],
    exports: [UserService]
})
export class UserModule {}
