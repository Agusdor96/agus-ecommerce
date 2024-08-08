import { Body, Controller, Delete, Get, Param, ParseUUIDPipe,Put, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { SwaggerDeleteUser, SwaggerGetUserById, SwaggerGetUsers, SwaggerUpdateUser } from "./swagger.decorator";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserService } from "./users.service";
import { AuthGuard } from "../auth/auth.guard";
import { Rolesenum } from "../auth/roles.enum";
import { RolesGuard } from "../guards/roles.guard";
import { Roles} from "../decorators/roles.decorator";
import { updateUserDto } from "./UserDtos/updateUser.dto"; 
import { IdUserInterceptor, PasswordInterceptor } from "./Interceptors/users.interceptors";
import { PassDto } from "./UserDtos/role.dto";

@ApiTags("Users")
@Controller("users")
export class UsersController {
    constructor(private readonly userService: UserService) {}
    @ApiBearerAuth()
    @Get()
    @SwaggerGetUsers()
    @Roles(Rolesenum.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    @UseInterceptors(PasswordInterceptor)
        getUsers(
            @Query('limit') limit?: number,
            @Query('page') page?: number){
            return this.userService.getUsers(Number(page), Number(limit));
        }

        
    @Put("/role/:id")
        updateRole(
            @Param("id", ParseUUIDPipe)id:string,
            @Body()adminPass:PassDto){
        return this.userService.updateRole(id, adminPass)
        }

        
    @ApiBearerAuth()
    @Get(":id")
    @UseInterceptors(PasswordInterceptor)
    @SwaggerGetUserById()
    @UseGuards(AuthGuard)
        getUserById(@Param("id", ParseUUIDPipe) id:string){   
            return this.userService.getUserById(id);
        }

    @ApiBearerAuth()
    @Put(":id")
    @SwaggerUpdateUser()
    @UseGuards(AuthGuard)
    @UseInterceptors(PasswordInterceptor, IdUserInterceptor)
        updateUser(
            @Param("id", ParseUUIDPipe)id:string, 
            @Body()modifiedUser:updateUserDto){
            return this.userService.updateUser(id, modifiedUser);
        }
    @ApiBearerAuth()
    @Delete(":id")
    @SwaggerDeleteUser()
    @UseGuards(AuthGuard)
    @UseInterceptors(IdUserInterceptor)
        deleteUser(@Param("id", ParseUUIDPipe)id:string){
            return this.userService.deleteUser(id);
        }
}
