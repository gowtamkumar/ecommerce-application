import "reflect-metadata";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { StackStatus } from "../enums/stock-status.enum";

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

  @Column({ name: "size_id", nullable: true })
  sizeId?: string;

  @Column({ nullable: true })
  size?: string;

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
