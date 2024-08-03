import "reflect-metadata";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductVariantEntity } from "../../product-variant/model/product-variant.entity";
import { OrderItemEntity } from "../../order/model/order-item.entity";

@Entity("sizes")
export class SizeEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: "boolean", default: true })
  status!: boolean;

  @Column({ name: "user_id" })
  userId!: number;

  @OneToMany(
    (_type) => ProductVariantEntity,
    (productVarients) => productVarients.size
  )
  productVariants!: ProductVariantEntity[];

  @OneToMany((_type) => OrderItemEntity, (orderItem) => orderItem.size)
  orderItems!: OrderItemEntity[];
}
