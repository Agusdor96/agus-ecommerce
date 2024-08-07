import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

export function SwaggerGetCategories(){
    return applyDecorators(
        ApiOperation({
            summary: "A list of the existing categories",
            description:"Here user has acces to all the existing cateogories."
        }),
        ApiResponse({status:200, description: "An array of objects with name of the categories"}),
        ApiResponse({status: 404, description: "No categories where found"})
    )
}

export function SwaggerSeederCategories(){
    return applyDecorators(
        ApiOperation({
            summary:"Preload of categories",
            description: "If no categories are saved in the DataBase, this endpoint will extraxct the categories from an extra file with a list of products with property category and preload them when the server is initialized."
        }),
        ApiResponse({status:200, description: "Categories loaded"}),
        ApiResponse({description: "There are categories in Data Base already"})
    )
}