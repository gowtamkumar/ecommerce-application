import "reflect-metadata";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ProductEntity } from "../../product/model/product.entity";
import { ColorEntity } from "../../../color/model/color.entity";

@Entity("product_colors")
export class ProductColorEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "color_id" })
  colorId?: number;
  @ManyToOne((_type) => ColorEntity, (color) => color.productColors, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "color_id" })
  color!: ColorEntity;
 
  @Column({ name: "product_id" })
  productId?: number;
  @ManyToOne((_type) => ProductEntity, (product) => product.productColors, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "product_id" })
  product!: ProductEntity;
}
