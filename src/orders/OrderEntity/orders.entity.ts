import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import {v4 as uuid} from "uuid"
import { User } from '../../users/UserEntity/users.entity';
import { OrderDetail } from "../../orderDetail/OrderDetailEntity/orderDetail.entity";

@Entity({
    name: "ORDERS"
})
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();
  
  @Column()
  date: string;
  
  @ManyToOne(() => User, user => user.orders, {cascade: true, onDelete: "CASCADE"})
  user: User;

  @OneToOne(() => OrderDetail, orderDetail => orderDetail.order, {cascade: true, onDelete: "CASCADE"})
  @JoinColumn({name: "order_detail"})
  orderDetail: Partial<OrderDetail>;
}