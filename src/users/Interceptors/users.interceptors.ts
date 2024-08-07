import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { User } from "../UserEntity/users.entity";


@Injectable()
export class  OneUserInterceptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler<User>): Observable<Partial<User>> {
        return next.handle().pipe(
            map((user) => {
                if(user){
                   const {password, isAdmin, ...notPassworUser} = user
                   return notPassworUser;
                }
            })
        )
    }
}
export class  PasswordInterceptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler<User[]>): Observable<Partial<User>[]> {
        return next.handle().pipe(
            map((data) => {
                return data.map((user)=> {
                   
                    const {password, ...notPassworUser} = user;
                   return notPassworUser;
                })
            })
        )
    }
}

