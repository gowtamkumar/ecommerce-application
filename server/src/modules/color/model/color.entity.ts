import "reflect-metadata";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductVariantEntity } from "../../product-variant/model/product-variant.entity";
import { OrderItemEntity } from "../../order/model/order-item.entity";

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

  @OneToMany(
    (_type) => ProductVariantEntity,
    (productVariant) => productVariant.color
  )
  productVariants!: ProductVariantEntity[];


  @OneToMany(
    (_type) => OrderItemEntity,
    (orderItems) => orderItems.color
  )
  orderItems!: OrderItemEntity[];
}
