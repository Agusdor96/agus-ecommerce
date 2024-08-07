import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

export function SwaggerSeederProd(){
    return applyDecorators(
        ApiOperation({
            summary: "PreLoad of products",
            description:"If no products are saved in the DataBase, this endpoint will load all products from an extra file when the server is initialized. Please make sure you did the preload of categories from /categories/seeder first. For adding products mannualy, use the POST endpoint"
        }),
        ApiResponse({status:200, description: "Products loaded succesfully."}),
        ApiResponse({status: 404, description: "There are products in Data Base already "})
    )
}
export function SwaggerGetProducts(){
    return applyDecorators(
        ApiOperation({
            summary: "A list of the existing products",
            description:"A list of all existing products, including those with stock 0."
        }),
        ApiResponse({status:200, description: "An array of objects with all the products data."}),
        ApiResponse({status: 404, description: "No products found "})
    )
}

export function SwaggerGetProductById(){
    return applyDecorators(
        ApiOperation({
            summary:"A specific product",
            description: "Gets one product and its information by its id."
        }),
        ApiResponse({status:200, description: "An object with the product data"}),
        ApiResponse({status: 404, description: "Product not found"})
    )
}

export function SwaggerCreateProduct(){
    return applyDecorators(
        ApiOperation({
            summary:"Create a new product",
            description: "You can create the product you like. The category you aplly to this product must exist. You will not be able to create a new category."
        }),
        ApiResponse({status: 201, description: "An object with the new product data"}),
        ApiResponse({status: 404, description: "Product already exists"})
    )
}
export function SwaggerUpdateProduct(){
    return applyDecorators(
        ApiOperation({
            summary:"Update product information",
            description: "Select a product by its Id and change the information you like besides the category. Only **ADMIN** role users have access to this endpoint."
        }),
        ApiResponse({status:200, description: "An object with product updated data"}),
        ApiResponse({status: 400, description: "This product is asigned to another Id in DataBase"}),
        ApiResponse({status: 404, description: "Could not found product to be updated"})
    )
}
export function SwaggerDeleteProduct(){
    return applyDecorators(
        ApiOperation({
            summary:"Delete one product",
            description: "Select one product by id and delet it. If product has relations it will delete them as well, and order detail price will be updated."
        }),
        ApiResponse({status: 200, description: "Product has been deleted succesfully"}),
        ApiResponse({status: 404, description: "Product not found"})
    )
}