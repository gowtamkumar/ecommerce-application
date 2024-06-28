import "reflect-metadata";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { OrderEntity } from "./order.entity";
import { ProductEntity } from "../../product/model/product.entity";

@Entity("order_items")
export class OrderItemEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "order_id" })
  orderId!: number;
  @ManyToOne((_type) => OrderEntity, (order) => order.orderItems, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "order_id" })
  order!: OrderEntity;

  @Column({ name: "total_amount", type: "numeric", precision: 14, scale: 2 })
  totalAmount!: number;

  @Column({ type: "numeric", precision: 10, scale: 2 })
  price!: number;

  @Column()
  qty!: number;

  @Column({ name: "product_id" })
  productId!: number;
  @ManyToOne((_type) => ProductEntity, (product) => product.orderItems, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "product_id" })
  product!: ProductEntity;

}
