import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Product } from '../../products/ProductEntity/products.entity';
import {v4 as uuid} from "uuid"

@Entity({
  name: 'CATEGORIES',
})
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  name: string;

  @OneToMany(() => Product, (products) => products.category)
  @JoinColumn()
  products: Product[];
}
