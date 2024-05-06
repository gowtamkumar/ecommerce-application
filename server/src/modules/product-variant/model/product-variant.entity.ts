import "reflect-metadata";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { StackStatus } from "../enums/stock-status.enum";
import { ProductEntity } from "../../product/model/product.entity";
import { SizeEntity } from "../../size/model/size.entity";

@Entity("product_variants")
export class ProductVariantEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "regular_price", type: "numeric", precision: 15, scale: 2 })
  regularPrice!: number;

  @Column({ name: "sale_price", type: "numeric", precision: 15, scale: 2 })
  salePrice!: number;

  @Column({ name: "product_id" })
  productId!: string;
  @ManyToOne((_type) => ProductEntity, (product) => product.productVariants, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "product_id" })
  product!: ProductEntity;

  @Column({ name: "size_id", nullable: true })
  sizeId?: string;
  @ManyToOne((_type) => SizeEntity, (size) => size.productVariants, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "size_id" })
  size!: SizeEntity;

  @Column({ nullable: true })
  sizes?: string;

  @Column({ nullable: true })
  color!: string;

  @Column({ nullable: true })
  weight?: number;

  //  stock qty thankle stock status hobe na
  @Column({ name: "stock_qty", nullable: true })
  stockQty?: number;

  @Column({
    name: "stock_status",
    type: "enum",
    enum: StackStatus,
    nullable: true,
  })
  stockStatus?: StackStatus;
}
