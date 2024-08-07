import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './UserEntity/users.entity';
import { pagination } from '../helpers/pagination.helper';
import { Order } from '../orders/OrderEntity/orders.entity';
import { ProductsService } from '../products/products.service';
import { OrderDetail } from '../orderDetail/OrderDetailEntity/orderDetail.entity';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Order)private orderRepository: Repository<Order>,
    @InjectRepository(OrderDetail) private orderDetailRepository: Repository<OrderDetail>,
    private productService: ProductsService) {}

  
  async  getUserEmail(email:string):Promise<User> {
    const userByMail = await this.userRepository.findOne({where: { email }});
    return userByMail
  }

  async getUsers(page: number, limit: number) {
    const allUsers:User[] = await this.userRepository.find();
      if(!allUsers){
        throw new NotFoundException("No users registered")
      }

    const paginatedUsers = pagination(page, limit, allUsers)
    return paginatedUsers;
        
  }

  async createUser(user: Partial<User>): Promise<User> {
    const newUser = await this.userRepository.save(user);
    if(!newUser){
      throw new BadRequestException("Error creating user")
    }
    return newUser
  }
  
  async getUserById(id: string): Promise<Partial<User>> {
    const userId = await this.userRepository.findOne({
      where: { id: id },
      relations: { orders: true },
    });

    if(!userId){
      throw new NotFoundException("User not found")
    } else{
      return userId;
    }
  }

  async updateUser(id: string, modifiedUser:Partial<User>): Promise<Partial<User>> {
    const chekUser = await this.userRepository.findOneBy({id:id})
    if(!chekUser){
      throw new NotFoundException("Could not found user to be updated")
    } 

      await this.userRepository.update(id, modifiedUser)
      const updatedUser = await this.userRepository.findOneBy({id:id});

      return updatedUser;
  }

  async deleteUser(id: string):Promise<{message:string}> {
    
    const user:User = await this.userRepository.findOneBy({ id: id });
    if(!user){
      throw new NotFoundException("Id does not belong to an existing user")
    }

    const userOrder:Order = await this.orderRepository.findOne({
      where: {
        user:{id:id},
      },
      relations: {
        orderDetail: true
      }
    })
    
    const orderDetail:Partial<OrderDetail> = userOrder.orderDetail
   
    const detailWithProd:OrderDetail = await this.orderDetailRepository.findOne({
      where:{
        id:orderDetail.id},
      relations: ["products"]
    })
  const prodId:string[] = detailWithProd.products.map((prod)=>prod.id)

  const deletedUser:User = await this.userRepository.remove(user);
    
    if(deletedUser){
      await this.orderDetailRepository.remove(detailWithProd)
      await this.productService.stockUpdate(prodId)
      return { message: `User deleted succesfully` };
    }
  }
}
