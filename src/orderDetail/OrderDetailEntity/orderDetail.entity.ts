import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToMany, JoinColumn, JoinTable } from 'typeorm';
import {v4 as uuid} from "uuid"
import { Order } from "../../orders/OrderEntity/orders.entity";
import { Product } from "../../products/ProductEntity/products.entity";

@Entity({
    name: "ORDER_DETAIL"
})
export class OrderDetail {
  @PrimaryGeneratedColumn("uuid")
  id: string = uuid();

  @Column({type: "decimal", precision: 10, scale: 2 })
  price: number;

  @OneToOne(() => Order, (order) => order.orderDetail)
  order: Order;

  @ManyToMany(() => Product, (product) => product.orderDetails)
  @JoinTable({name: "ORDER_PRODUCTS_DETAILS"})
  products: Product[];
}