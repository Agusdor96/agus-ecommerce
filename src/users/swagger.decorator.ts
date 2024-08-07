import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

export function SwaggerGetUsers(){
    return applyDecorators(
        ApiOperation({
            summary: "A list of the existing users",
            description:"A list of all registerd users. Only **ADMIN** role users have access to this endpoint."
        }),
        ApiResponse({status:200, description: "An array of objects with all the users data except for the password"}),
        ApiResponse({status: 404, description: "No users registered "})
    )
}

export function SwaggerGetUserById(){
    return applyDecorators(
        ApiOperation({
            summary:"A specific user",
            description: "Gets one user and its information by its id. It does not return its password."
        }),
        ApiResponse({status:200, description: "An object with users data"}),
        ApiResponse({status: 404, description: "User not found"})
    )
}
export function SwaggerUpdateUser(){
    return applyDecorators(
        ApiOperation({
            summary:"Update user information",
            description: "Select a user by its id and change the information you like. Does not give the option to change password. That sould be done on another endpoint thas has not been defined at the moment"
        }),
        ApiResponse({status:200, description: "An object with users updated data"}),
        ApiResponse({status: 404, description: "Could not found user to be updated"})
    )
}
export function SwaggerDeleteUser(){
    return applyDecorators(
        ApiOperation({
            summary:"Delete one user",
            description: "Select a user by its id and Delete it from DataBase. If user has relation to Orders, it will delete the order, the order detail and it will update the product stock"
        }),
        ApiResponse({status:200, description: "User deleted succesfully"}),
        ApiResponse({status: 404, description: "User does not exist"})
    )
}