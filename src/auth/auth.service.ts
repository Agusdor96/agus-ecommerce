import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt"
import { UserService } from "../users/users.service";
import { User } from "../users/UserEntity/users.entity";

@Injectable()
export class AuthService {
    constructor(
        private userService:UserService,
        private jwtService: JwtService,){}
        
    async signUp(user: Partial<User>): Promise<{success: string}> {
    const signUser = await this.userService.getUserEmail(user.email);

        if(signUser){
            throw new BadRequestException("Email already exist")
        }
        
        const hashedPassword = await bcrypt.hash(user.password, 10)
        
        if(!hashedPassword){
            throw new BadRequestException("Password could not be hashed")
        }
        const registUser = await this.userService.createUser({...user, password:hashedPassword})
        return {success: `user registered succesfully with id:${registUser.id}!`}
    }

   async logInUser(email:string, password:string): Promise<{message:string, token: string}> {
        const checkUser= await this.userService.getUserEmail(email)
        if(!checkUser){
            throw new BadRequestException("Invalid credentials")
        }
                
        const checkPassword = await bcrypt.compare(password, checkUser.password)

        if(!checkPassword){
            throw new BadRequestException("Invalid credentials")
        }

        const userPayload = {
            id: checkUser.id,
            email: checkUser.email,
            isAdmin: checkUser.isAdmin,
        }

        const token = this.jwtService.sign(userPayload)

        if(!token){
            throw new InternalServerErrorException("Could not asign token to user")
        }
        return {message: `user with id:${checkUser.id} loged succesfully`, token}
    }
}
