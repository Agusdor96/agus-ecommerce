import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from 'typeorm';
import {v4 as uuid} from "uuid"
import { Order } from '../../orders/OrderEntity/orders.entity';

@Entity({
    name: "USERS"
})
export class User {
    @PrimaryGeneratedColumn('uuid')
        id: string = uuid();

    @Column({ type: "varchar", length: 50, nullable: false})
        name: string;

    @Column({ type: "varchar", length: 50, unique: true, nullable: false })
        email: string;

    @Column({ type: "text", nullable: false })
        password: string;

    @Column({type: "bigint"})
        phone: string;

    @Column({ type: "varchar", length: 50})
        country: string;

    @Column('text')
        address: string;

    @Column({ type: "varchar", length: 50})
        city: string;

    @OneToMany(() => Order, (order) => order.user)
    @JoinColumn({name: "order_id"})
    orders: Order[];
    
    @Column({default: false})
    isAdmin: boolean;
}