import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoryService } from "./categories.service";
import { CategoryController } from "./categories.controller";
import { Category } from "./CategoryEntity/categories.entity";

@Module({
    imports:[TypeOrmModule.forFeature([Category])],
    providers:[CategoryService],
    controllers: [CategoryController],
    exports:[CategoryService]
})

export class CategoryModule {}