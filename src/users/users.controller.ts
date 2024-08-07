import { Body, Controller, Delete, Get, Param, ParseUUIDPipe,Put, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { SwaggerDeleteUser, SwaggerGetUserById, SwaggerGetUsers, SwaggerUpdateUser } from "./swagger.decorator";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserService } from "./users.service";
import { AuthGuard } from "../auth/auth.guard";
import { Rolesenum } from "../auth/roles.enum";
import { RolesGuard } from "../guards/roles.guard";
import { Roles} from "../decorators/roles.decorator";
import { updateUserDto } from "./UserDtos/updateUser.dto"; 
import { OneUserInterceptor, PasswordInterceptor } from "./Interceptors/users.interceptors";

@ApiTags("Users")
@Controller("users")
export class UsersController {
    constructor(private readonly userService: UserService) {}
    @ApiBearerAuth()
    @Get()
    @UseInterceptors(PasswordInterceptor)
    @SwaggerGetUsers()
    @Roles(Rolesenum.Admin)
    @UseGuards(AuthGuard, RolesGuard)
        getUsers(
            @Query('limit') limit?: number,
            @Query('page') page?: number){
            return this.userService.getUsers(Number(page), Number(limit));
        }
        
    @ApiBearerAuth()
    @Get(":id")
    @UseInterceptors(OneUserInterceptor)
    @SwaggerGetUserById()
    @UseGuards(AuthGuard)
        getUserById(@Param("id", ParseUUIDPipe) id:string){   
            return this.userService.getUserById(id);
        }

    @ApiBearerAuth()
    @Put(":id")
    @UseInterceptors(OneUserInterceptor)
    @SwaggerUpdateUser()
    @UseGuards(AuthGuard)
        updateUser(
            @Param("id", ParseUUIDPipe)id:string, 
            @Body()modifiedUser:updateUserDto){
            return this.userService.updateUser(id, modifiedUser);
        }
    @ApiBearerAuth()
    @Delete(":id")
    @SwaggerDeleteUser()
    @UseGuards(AuthGuard)
        deleteUser(@Param("id", ParseUUIDPipe)id:string){
            return this.userService.deleteUser(id);
        }
}
