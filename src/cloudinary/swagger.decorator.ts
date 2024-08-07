import { applyDecorators, UploadedFile } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

export function SwaggerUpdateFiles(){
    return applyDecorators(
        ApiOperation({
            summary: "Upload an image to a specific product",
            description: "This endpoint gives you the posibility to upload an image to cloudinary, so that you can store and manage the images for your products. You will provide the Id of the product and an image file from your local computer, the image will be uploaded to cloudinary and then it will be asigned to the product. For this you should create your profile at cloudinary and do the configuration on your project"
        }),
        ApiResponse({status: 200, description:"An object of the product with the image url from cloudinary"}),
        ApiResponse({status: 400, description: "Bad Request"}),
        ApiResponse({status: 404, description: "Product not found"}),
        ApiResponse({status: 409, description: "Error updating product or Image could not be uploaded to Cloudinary"}),
        

        
    )
}