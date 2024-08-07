import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { SwaggerCreateProduct, SwaggerDeleteProduct, SwaggerGetProductById, SwaggerGetProducts, SwaggerSeederProd, SwaggerUpdateProduct} from "./swagger.decorator";
import { Rolesenum } from "../auth/roles.enum";
import { AuthGuard } from "../auth/auth.guard";
import { RolesGuard } from "../guards/roles.guard";
import { ProductsService } from "./products.service";
import { Roles } from "../decorators/roles.decorator";
import { ProductDto } from "./ProductDtos/product.dto";
import { UpdateProductDto } from "./ProductDtos/updateProduct.dto";

@ApiTags("Products")
@Controller("products")
export class ProductsController{
    constructor(private readonly productsService: ProductsService){}

    @Get()
    @SwaggerGetProducts()
        getProducts( 
            @Query('limit') limit?: number,
            @Query('page') page?: number){
            return this.productsService.getProducts(Number(page), Number(limit))
        }
        
    @ApiBearerAuth()
    @Post()
    @SwaggerCreateProduct()
    @UseGuards(AuthGuard)
        createProduct(@Body()product:ProductDto){
            return this.productsService.createProduct(product);
        }
        
    @Get("seeder")
    @SwaggerSeederProd()
        preLoadProd(){
            return this.productsService.preLoadProd()
        }
    
    @Get(":id")
    @SwaggerGetProductById()
        getProductById(@Param("id", ParseUUIDPipe) id:string){
            return this.productsService.getProductById(id);
        }

    @ApiBearerAuth()
    @Put(":id")
    @SwaggerUpdateProduct()
    @Roles(Rolesenum.Admin)
    @UseGuards(AuthGuard, RolesGuard)
        updateProduct(
            @Param("id", ParseUUIDPipe)id:string, 
            @Body() modifiedProduct:UpdateProductDto){
            return this.productsService.updateProduct(id, modifiedProduct);
        }

    @ApiBearerAuth()
    @Delete(":id")
    @SwaggerDeleteProduct()
    @UseGuards(AuthGuard)
        deleteProduct(@Param("id", ParseUUIDPipe)id:string){
            return this.productsService.deleteProduct(id);
        }
}