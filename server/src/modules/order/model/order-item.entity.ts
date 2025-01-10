import "reflect-metadata";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { OrderEntity } from "./order.entity";
import { ProductEntity } from "../../products/product/model/product.entity";
import { ProductVariantEntity } from "../../products/product-variant/model/product-variant.entity";

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

  @Column({
    name: "unit_price",
    type: "numeric",
    precision: 10,
    scale: 2
  })
  unitPrice!: string;

  @Column({
    name: "purchase_price",
    type: "numeric",
    precision: 10,
    scale: 2,
  })
  purchasePrice!: string;

  @Column()
  qty!: number;

  @Column({
    name: "tax_amount",
    type: "numeric",
    precision: 10,
    scale: 2,
    nullable: true,
  })
  taxAmount!: string;

  @Column({
    name: "discount_amount",
    type: "numeric",
    precision: 10,
    scale: 2,
    nullable: true,
  })
  discountAmount!: string;

  @Column({ name: "product_id" })
  productId!: number;
  @ManyToOne((_type) => ProductEntity, (product) => product.orderItems, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "product_id" })
  product!: ProductEntity;

  @Column({ name: "color_id", nullable: true })
  colorId!: number;
  // @ManyToOne((_type) => ColorEntity, (color) => color.orderItems, {
  //   onDelete: "CASCADE",
  // })
  // @JoinColumn({ name: "color_id" })
  // color!: ColorEntity;

  @Column({ name: "product_variant_id" })
  productVariantId!: number;
  @ManyToOne((_type) => ProductVariantEntity, (product) => product.orderItems, {
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "product_variant_id" })
  productVariant!: ProductVariantEntity;
}
