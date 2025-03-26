import "reflect-metadata";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("applicable_categories")
export class ApplicableCategoryEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "category_id" })
  categoryId!: number;
  // @ManyToOne((_type) => ProductEntity, (product) => product.couponProducts, {
  //   onDelete: "CASCADE",
  // })
  // @JoinColumn({ name: "product_id" })
  // product!: ProductEntity;

  @Column({ name: "discount_id" })
  discountId?: number;
  // @ManyToOne((_type) => CouponEntity, (coupon) => coupon.products, {
  //   onDelete: "CASCADE",
  // })
  // @JoinColumn({ name: "coupon_id" })
  // coupon!: CouponEntity;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt?: string;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt?: string;
}
