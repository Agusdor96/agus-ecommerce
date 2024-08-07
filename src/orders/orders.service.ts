import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, MoreThan, Repository } from "typeorm";
import { Order } from "./OrderEntity/orders.entity";
import { User } from "../users/UserEntity/users.entity";
import { ProductsService } from "../products/products.service";
import { Product } from "../products/ProductEntity/products.entity";
import { OrderDetail } from "../orderDetail/OrderDetailEntity/orderDetail.entity";

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order) private orderRepository:Repository<Order>,
        @InjectRepository(Product) private productRepository:Repository<Product>,
        @InjectRepository(OrderDetail) private orderDetailRepo: Repository<OrderDetail>,
        @InjectRepository(User)private userRepo:Repository<User>,
        private productService:ProductsService
        ){}
      
    async getOrder(orderId: string): Promise<Order> {
        const order = await this.orderRepository.findOne({
            where:{id:orderId},
            relations: {
                orderDetail: {
                products:true
            }}
        })
        if(!order){
            throw new NotFoundException('Order not found')
        }
       
        return order
    }

    async addOrder(userId: string, product:{id:string}[]):Promise<Partial<Order>> {
        const userById = await this.userRepo.findOne({where:{id:userId}});

        if(!userById){
            throw new NotFoundException('user not found')
        }

        const date = new Date().toLocaleString();
        const order = await this.orderRepository.save({date, user:userById})
        
        if(!order){
            throw new ConflictException("Something went wrong trying to save order in DB")
        }

        const productId = product.map(product => product.id)
        const products = await this.productRepository.find({
            where: { 
                id: In(productId), 
                stock: MoreThan(0)
            }
        })
        if(!products.length){
            throw new BadRequestException("products out of stock")
        }else{
                let total = 0;
                for(const product of products){
                        total += Number(product.price);
                        product.stock -= 1;

                        const updatedProduct = await this.productRepository.save(product)
                        if(!updatedProduct){
                            throw new ConflictException("Something went wrong trying to upDate the product")
                        }
                }
                const detail = await this.orderDetailRepo.save({price: total, products})        
                    order.orderDetail = detail;
        
                if(!detail.products || !order.orderDetail){
                    throw new InternalServerErrorException("orderDetail and products properties needed for relations")
                }
                const orderWithDetail = await this.orderRepository.save(order);
                if(!detail){
                    throw new ConflictException("Something went wrong trying to save OrderDetail")
                }
                
                return {
                    id: orderWithDetail.id,
                    date: orderWithDetail.date,
                    orderDetail:{
                        id:detail.id,
                        price:detail.price
                    }       
                }
            }
        
    }

    async deleteOrder(id: string) {
        const order = await this.orderRepository.findOne({
            where:{
                id:id
            },
            relations: {
                orderDetail:true
            }
        })

        if(!order){
            throw new NotFoundException("Id does not belong to an existing order")
        }
        
        const orderDetail = order.orderDetail
        const detail = await this.orderDetailRepo.findOne({
            where: {
                id: orderDetail.id},
            relations: ["products"]
        })
        
        const prodId = detail.products.map((oneProd)=> oneProd.id)
        const deletedOrder = await this.orderRepository.remove(order)
        
        if(deletedOrder){
            await this.orderDetailRepo.remove(detail)
            await this.productService.stockUpdate(prodId);
            return { message: `Order deleted succesfully`};
        }
    }
}