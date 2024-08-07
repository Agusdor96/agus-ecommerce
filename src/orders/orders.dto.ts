import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { Product } from "../products/ProductEntity/products.entity";

export class OrderDto {

    @ApiProperty({
        example: "UUID del usuario",
      })
    @IsNotEmpty()
    @IsString()
    @IsUUID()
    userId: string;

    @ApiProperty({
        example: '[{"id":"UUID producto 1"},{"id":"UUID producto2"}]'
      })
    @IsNotEmpty()
    @IsArray()
    products: Partial<Product[]>;
}