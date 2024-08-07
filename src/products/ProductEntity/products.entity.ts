import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import {v4 as uuid} from "uuid"
import { Category } from '../../categories/CategoryEntity/categories.entity';
import { OrderDetail } from '../../orderDetail/OrderDetailEntity/orderDetail.entity';

@Entity({
  name:"PRODUCTS"
})
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id: string = uuid();

  @Column({type: "varchar", length: 50, unique:true, nullable: false})
  @IsNotEmpty()
  name: string;

  @Column({type: "text", nullable: false})
  @IsNotEmpty()
  description: string;

  @Column({type: "decimal", precision: 10, scale: 2 })
  @IsNotEmpty()
  price: number;

  @Column({type: "int", nullable: false})
  @IsNotEmpty()
  stock: number;

  @Column({ type: "text", nullable: false, default: "default-image-url" })
  @IsNotEmpty()
  imgurl: string;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @ManyToMany(() => OrderDetail, (orderDetail) => orderDetail.products, {cascade: true, onDelete: "CASCADE"})
  orderDetails: OrderDetail[];
}