import "reflect-metadata";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "../../auth/model/user.entity";
import { ReviewEntity } from "../../review/model/review.entity";
import { ProductStatus } from "../enums/product-status.enum";
import { ProductType } from "../enums/product-type.enum";
import { ProductVariantEntity } from "../../product-variant/model/product-variant.entity";

@Entity("products")
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: "enum", enum: ProductType })
  type!: ProductType;

  @Column({ name: "shipping_cost", type: "numeric", precision: 15, scale: 2 })
  shippingCost!: string;

  @Column({ name: "tax_id", nullable: true })
  taxId?: string;

  @Column({ name: "url_slug", unique: true })
  urlSlug!: string;

  @Column({ type: "simple-array", nullable: true })
  images!: string[];

  @Column({ name: "single_image", nullable: true })
  singleImage!: string;

  @Column({ name: "brand_id", nullable: true })
  brandId?: string;

  @Column({ name: "category_id", nullable: true })
  categoryId?: string;

  @Column({ nullable: true })
  color?: string;

  @Column({ name: "limit_purchase_qty", nullable:true })
  limitPurchaseQty?: number;

  @Column({ name: "product_tag", type: 'simple-array', nullable: true })
  productTag!: string[];

  @Column({ nullable: true })
  description?: string;

  @Column({ name: "short_description", nullable: true })
  shortDescription?: string;

  @Column({ name: "enable_review", type: "boolean", default: true })
  enableReview?: boolean;

  @Column({ name: "user_id", nullable: true })
  userId?: string;
  @ManyToOne((_type) => UserEntity, (user) => user.products)
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;

  @Column({ type: "enum", enum: ProductStatus, default: ProductStatus.Active })
  status!: ProductStatus;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt?: string;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt?: string;

  // Relations

  @OneToMany((_type) => ReviewEntity, (review) => review.product)
  reviews!: ReviewEntity[];

  @OneToMany((_type) => ProductVariantEntity, (productVaritant) => productVaritant.product)
  productVariants!: ProductVariantEntity[];
}
