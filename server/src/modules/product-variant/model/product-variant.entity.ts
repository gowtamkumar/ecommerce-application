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
import { ProductEntity } from "../../product/model/product.entity";
import { SizeEntity } from "../../size/model/size.entity";
import { ColorEntity } from "../../color/model/color.entity";
import { OrderItemEntity } from "../../order/model/order-item.entity";
import { CartEntity } from "../../cart/model/cart.entity";

@Entity("product_variants")
export class ProductVariantEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "numeric",
    precision: 15,
    scale: 2,
  })
  price!: number;

  @Column({
    name: "purchase_price",
    type: "numeric",
    precision: 15,
    scale: 2,
  })
  purchasePrice!: number;

  @Column({ name: "product_id" })
  productId!: number;
  @ManyToOne((_type) => ProductEntity, (product) => product.productVariants, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "product_id" })
  product!: ProductEntity;

  @Column({ name: "size_id", nullable: true })
  sizeId?: number;
  @ManyToOne((_type) => SizeEntity, (size) => size.productVariants, {
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "size_id" })
  size!: SizeEntity;

  @Column({ name: "color_id", nullable: true })
  colorId!: number;
  @ManyToOne((_type) => ColorEntity, (color) => color.productVariants, {
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "color_id" })
  color!: ColorEntity;

  // @Column({ type: "simple-array", nullable: true })
  // images!: string[];

  @Column({ nullable: true })
  weight?: string;

  @Column({ name: "stock_qty", nullable: true })
  stockQty?: number;

  @OneToMany((_type) => OrderItemEntity, (items) => items.productVariant)
  orderItems!: OrderItemEntity[];

  @OneToMany((_type) => CartEntity, (cart) => cart.productVariant)
  carts!: CartEntity[];
}
