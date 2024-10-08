import "reflect-metadata";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { OrderEntity } from "./order.entity";
import { ProductEntity } from "../../product/model/product.entity";
import { ProductVariantEntity } from "../../product-variant/model/product-variant.entity";
import { ColorEntity } from "../../color/model/color.entity";
import { SizeEntity } from "../../size/model/size.entity";

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

  @Column({ type: "numeric", precision: 10, scale: 2 })
  price!: string;

  @Column({
    name: "purchase_price",
    type: "numeric",
    precision: 10,
    scale: 2,
    nullable: true,
  })
  purchasePrice!: string;

  @Column()
  qty!: number;

  @Column({ type: "numeric", precision: 10, scale: 2, nullable: true })
  tax!: string;

  @Column({
    name: "discount_amount",
    type: "numeric",
    precision: 10,
    scale: 2,
    nullable: true,
  })
  discountA!: string;

  @Column({ name: "product_id" })
  productId!: number;
  @ManyToOne((_type) => ProductEntity, (product) => product.orderItems, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "product_id" })
  product!: ProductEntity;

  @Column({ name: "color_id", nullable: true })
  colorId!: number;
  @ManyToOne((_type) => ColorEntity, (color) => color.orderItems, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "color_id" })
  color!: ColorEntity;

  @Column({ name: "size_id", nullable: true })
  sizeId!: number;
  @ManyToOne((_type) => SizeEntity, (size) => size.orderItems, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "size_id" })
  size!: SizeEntity;

  @Column({ name: "product_variant_id" })
  productVariantId!: number;
  @ManyToOne((_type) => ProductVariantEntity, (product) => product.orderItems, {
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "product_variant_id" })
  productVariant!: ProductVariantEntity;
}
