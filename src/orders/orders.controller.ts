import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { SwaggerCreateOrder, SwaggerDeleteOrder, SwaggerGetOrderById } from "./swagger.decorator";
import { OrderService } from "./orders.service";
import { OrderDto } from "./orders.dto";
import { AuthGuard } from "../auth/auth.guard";

@ApiTags("Orders")
@Controller("orders")
export class OrdersController {
    constructor(private ordersService: OrderService) {}

    @ApiBearerAuth()
    @Post()
    @SwaggerCreateOrder()
    @UseGuards(AuthGuard)
    addOrder(@Body() orderDto:OrderDto){
        return this.ordersService.addOrder(orderDto.userId, orderDto.products)
    }
    @ApiBearerAuth()
    @Get(":id")
    @SwaggerGetOrderById()
    @UseGuards(AuthGuard)
    getOrder(@Param("id", ParseUUIDPipe)orderId:string){
        return this.ordersService.getOrder(orderId)
    }

    @ApiBearerAuth()
    @Delete(":id")
    @SwaggerDeleteOrder()
    @UseGuards(AuthGuard)
        deleteOrder(@Param("id", ParseUUIDPipe)id:string){
            return this.ordersService.deleteOrder(id)
        }
}
