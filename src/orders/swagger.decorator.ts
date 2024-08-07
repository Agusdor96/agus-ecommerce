import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

export function SwaggerCreateOrder(){
    return applyDecorators(
        ApiOperation({
            summary: "Create an order",
            description:"Select an specific user by its id and add the products, also by id, you would like this order to have. This will atomatically create an order Detail. While orders relate to users and order details, the order detail is who actually relates to the products."
        }),
        ApiResponse({status: 201, description: "An object with the order data and the relation with the order detail"}),
        ApiResponse({status: 404, description: "User not found"}),
        ApiResponse({status: 409, description: "products out of stock"}),
        ApiResponse({status: 500, description: "orderDetail and products properties needed for relations"})
    )
}

export function SwaggerGetOrderById(){
    return applyDecorators(
        ApiOperation({
            summary:"A specific Order",
            description: "Get the information of one order by its id."
        }),
        ApiResponse({status:200, description: "An object with the order data and all the relations"}),
        ApiResponse({status: 404, description: "Order not found"})
    )
}
export function SwaggerDeleteOrder(){
    return applyDecorators(
        ApiOperation({
            summary:"Delete a specific Order",
            description: "This will delete an order and all relations, product stock will be updated."
        }),
        ApiResponse({status:200, description: "Order deleted succesfully"}),
        ApiResponse({status: 404, description: "Id does not belong to an existing order"})
    )
}