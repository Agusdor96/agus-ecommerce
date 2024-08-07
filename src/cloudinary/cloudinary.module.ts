import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CloudinaryService } from "./cloudinary.service";
import { ProductsModule } from "../products/products.module";
import { CloudinaryConfig } from "../config/cloudinaryConfig";
import { CloudinaryRepository } from "./cloudinary.repository";
import { CloudinaryController } from "./cloudinary.controller";
import { Product } from "../products/ProductEntity/products.entity";

@Module({
    imports:[ProductsModule, TypeOrmModule.forFeature([Product])],
    providers: [CloudinaryService, CloudinaryConfig, CloudinaryRepository],
    controllers: [CloudinaryController]
})

export class CloudinaryModule {}