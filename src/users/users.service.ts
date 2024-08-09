import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './UserEntity/users.entity';
import { pagination } from '../helpers/pagination.helper';
import { Order } from '../orders/OrderEntity/orders.entity';
import { ProductsService } from '../products/products.service';
import { OrderDetail } from '../orderDetail/OrderDetailEntity/orderDetail.entity';
import { PassDto } from './UserDtos/role.dto';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class UserService {
  private readonly rolePass: string = process.env.ADMIN_PASS;
  
  
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Order)private orderRepository: Repository<Order>,
    @InjectRepository(OrderDetail) private orderDetailRepository: Repository<OrderDetail>,
    private productService: ProductsService) {}

  
  async updateRole(id: string, adminPass:PassDto) {
      const user = await this.userRepository.findOneBy({id})
      if(!user){
        throw new NotFoundException("User not found")
      }
      
      user.isAdmin = true
      
      console.log(this.rolePass);
      
      if(adminPass.password !== this.rolePass){
        throw new BadRequestException("password not valid")
      }
      
      await this.userRepository.update(id, user)
      return (`${user.name} has the ADMIN role now`)
      
  }
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

    const userOrder = await this.orderRepository.findOne({
      where: {
        user:{id:id},
      },
      relations: {
        orderDetail: true
      }
    })
    
    if(userOrder && userOrder.orderDetail){

      const detailWithProd:OrderDetail = await this.orderDetailRepository.findOne({
        where:{
          id:userOrder.orderDetail.id},
          relations: ["products"]
      })
      
      if(detailWithProd){
        const prodId:string[] = detailWithProd.products.map((prod)=>prod.id)
        
        await this.userRepository.remove(user);

        await this.orderDetailRepository.remove(detailWithProd)
        await this.productService.stockUpdate(prodId)
        return { message: `User deleted succesfully` };
      }
    } else {
      await this.userRepository.remove(user);
      return { message: `User deleted successfully` };

    }
  }
}
