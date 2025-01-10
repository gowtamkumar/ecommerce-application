import "reflect-metadata";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ProductEntity } from "../../product/model/product.entity";
import { SizeEntity } from "../../../size/model/size.entity";
import { OrderItemEntity } from "../../../order/model/order-item.entity";
import { CartEntity } from "../../../cart/model/cart.entity";

@Entity("product_variants")
export class ProductVariantEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    name: "unit_price",
    type: "numeric",
    precision: 15,
    scale: 2
  }) 
  unitPrice!: number;

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

 
  @Column({ type: "boolean", default: false }) 
  default?: boolean;

  @Column({ name: "stock_qty" })
  stockQty?: number;
  

  @OneToMany((_type) => OrderItemEntity, (items) => items.productVariant)
  orderItems!: OrderItemEntity[];

  @OneToMany((_type) => CartEntity, (cart) => cart.productVariant)
  carts!: CartEntity[];
}
