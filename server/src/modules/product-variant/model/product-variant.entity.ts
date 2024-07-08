import "reflect-metadata";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ProductEntity } from "../../product/model/product.entity";
import { SizeEntity } from "../../size/model/size.entity";
import { ColorEntity } from "../../color/model/color.entity";

@Entity("product_variants")
export class ProductVariantEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "regular_price", type: "numeric", precision: 15, scale: 2 })
  regularPrice!: number;

  @Column({ name: "sale_price", type: "numeric", precision: 15, scale: 2 })
  salePrice!: number;

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
}
