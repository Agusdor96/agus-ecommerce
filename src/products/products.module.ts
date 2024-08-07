import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthGuard } from "../auth/auth.guard";
import { ProductsService } from "./products.service";
import { Product } from "./ProductEntity/products.entity";
import { ProductsController } from "./products.controller";
import { Category } from "../categories/CategoryEntity/categories.entity";
import { OrderDetail } from "../orderDetail/OrderDetailEntity/orderDetail.entity";

@Module({
    imports:[TypeOrmModule.forFeature([Product, Category, OrderDetail])],
    providers: [ProductsService, AuthGuard],
    controllers: [ProductsController],
    exports: [ProductsService]
})
export class ProductsModule {}