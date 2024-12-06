import "reflect-metadata";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ProductColorEntity } from "../../products/product-color/model/product-color.entity";

@Entity("colors")
export class ColorEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  color!: string;

  @Column({ name: "user_id" })
  userId!: number;

  @OneToMany((_type) => ProductColorEntity, (items) => items.color)
  productColors!: ProductColorEntity[];
}
