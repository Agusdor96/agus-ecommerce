import { CallHandler, ExecutionContext, ForbiddenException, Injectable, NestInterceptor } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { map, Observable } from "rxjs";
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from "../../Interfaces/JwtPayload.interface";

@Injectable()
export class  PasswordInterceptor implements NestInterceptor{
    
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        
        return next.handle().pipe(
            map((data) => {
                
                if(Array.isArray(data)){
                    return data.map((user)=> {
                    const {password, ...notPassworUser} = user;
                    return notPassworUser;
                })
                }else{
                                      
                    const {password, isAdmin, ...notPassworUser} = data
                    return notPassworUser;
                }
            })
        )
    }
}

export class IdUserInterceptor implements NestInterceptor{
    constructor(private readonly jwtService: JwtService){}
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest()
        const token = request.headers["authorization"].split(" ")[1]
        
        const decoded = jwt.decode(token) as JwtPayload
        
        const userRequestId = decoded.id
        const userToBeDeletedId = request.params.id;

        if(userRequestId !== userToBeDeletedId) throw new ForbiddenException("This User has no access for this action")
        
        return next.handle()
    }
}

