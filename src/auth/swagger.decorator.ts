import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

export function SignUpSwagger(){
    return applyDecorators(
        ApiOperation({
            summary: "User registration",
            description:"Allows a new user to signUp providing all the required fields by LoginUserDto which is an extension from CreateUserDto. In this instance users password will be hashed for secutiry."
        }),
        ApiResponse({status:201, description: "user registered succesfully with id:userId"}),
        ApiResponse({status: 400, description: "Bad Request"})
    )
}

export function SwaggerLogInUser(){
    return applyDecorators(
        ApiOperation({
            summary:"User login",
            description: "A registered user can sign in providing his credentials:email and password. By default the role will be asigned to USER. A new token will be created for this user and will expire after one hour (1h)."
        }),
        ApiResponse({status:201, description: "user with id:userId loged succesfully"}),
        ApiResponse({status: 400, description: "Invalid Credentials"})
    )
}