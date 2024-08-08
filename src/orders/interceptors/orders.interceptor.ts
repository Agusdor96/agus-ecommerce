import { CallHandler, ExecutionContext, ForbiddenException, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from "../../Interfaces/JwtPayload.interface";
import { Order } from "../OrderEntity/orders.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class CreateOrderInterceptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest()
        const token = request.headers["authorization"].split(" ")[1]
        const createOrderUserId = request.body.userId
        
        const decoded = jwt.decode(token) as JwtPayload
        const userRequestingId = decoded.id

        if(createOrderUserId !== userRequestingId) throw new ForbiddenException("This User has no access for this action")

       
        return next.handle()
    }
}

export class IdOrderInterceptor implements NestInterceptor { 
    constructor(@InjectRepository(Order) private readonly orderRepo: Repository<Order>){}  

   async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest()
        const orderId:string = request.params.id
        const order:Order = await this.orderRepo.findOne({
            where: {id:orderId},
            relations: {user:true}
        })
        
        
        const token = request.headers["authorization"].split(" ")[1]
        const decoded = jwt.decode(token) as JwtPayload
        const userRequestingId = decoded.id

        const idUsersOrder:string = order.user.id

        if(userRequestingId !== idUsersOrder) throw new ForbiddenException("This User has no access for this action")
        return next.handle()
    }
}