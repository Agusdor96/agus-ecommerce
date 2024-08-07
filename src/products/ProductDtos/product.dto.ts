import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class ProductDto {
    @ApiProperty({ description: 'The name of the product', example: 'Iphone 15' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ description: 'Description of the product', example: 'The best smartphone in the world' })
    @IsNotEmpty()
    @IsString()
    description:string;

    @ApiProperty({ description: 'Price of the product', example: 199 })
    @IsNumber()
    @IsNotEmpty()
    price: number;

    @ApiProperty({ description: 'Stock quantity of the product', example: 12 })
    @IsNotEmpty()
    @IsNumber()
    stock: number;

    @ApiProperty({ description: 'Image URL of the product', example: 'default-image-url' })
    @IsNotEmpty()
    @IsString()
    imgurl: string;

    @ApiProperty({ description: 'Name of category where product will be listed', example: 'smartphone' })
    @IsNotEmpty()
    category: string;
}