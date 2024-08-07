import { BadRequestException, Body, Controller, Get, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "./LoginUser.dto";
import { CreateUserDto } from "../users/UserDtos/users.dto"
import { SignUpSwagger, SwaggerLogInUser } from "./swagger.decorator";

@ApiTags("Auth")
@Controller("auth")
export class AuthController{
    constructor(private readonly authService:AuthService){}

    @Post("signup")
    @SignUpSwagger()
    signUp(@Body()user:CreateUserDto){
        if(user.password !== user.confirmPassword){
            return new BadRequestException("Passwords do not match")
        }
        return this.authService.signUp(user)
    }    
    
    @Post("signin")
    @SwaggerLogInUser()
    logInUser(@Body() userCred: LoginUserDto){
        return this.authService.logInUser(userCred.email, userCred.password)
    }
}


