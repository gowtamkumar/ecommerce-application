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
import { TaxEntity } from "../../tax/model/tax.entity";
import { BrandEntity } from "../../brand/model/brand.entity";
import { ProductCategoryEntity } from "../../product-category/model/product-category.entity";
import { WishListEntity } from "../../wishlist/model/wishlist.entity";
import { OrderItemEntity } from "../../order/model/order-item.entity";

@Entity("products")
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: "enum", enum: ProductType })
  type!: ProductType;

  // @Column({ type: "numeric", precision: 15, scale: 2 })
  // price!: number;

  @Column({ name: "shipping_cost", type: "numeric", precision: 15, scale: 2 })
  shippingCost!: number;

  @Column({ name: "tax_id", nullable: true })
  taxId?: number;
  @ManyToOne((_type) => TaxEntity, (tax) => tax.products)
  @JoinColumn({ name: "tax_id" })
  tax?: TaxEntity;

  @Column({ name: "url_slug", unique: true })
  urlSlug!: string;

  @Column({ type: "simple-array", nullable: true })
  images!: string[];

  @Column({ name: "single_image", nullable: true })
  singleImage!: string;

  @Column({ name: "brand_id", nullable: true })
  brandId?: number;
  @ManyToOne((_type) => BrandEntity, (brand) => brand.products)
  @JoinColumn({ name: "brand_id" })
  brand?: BrandEntity;

  @Column({ name: "discount_id", nullable: true })
  discountId?: number;

  @Column({ nullable: true })
  color?: string;

  @Column({ name: "limit_purchase_qty", nullable: true })
  limitPurchaseQty?: number;

  @Column({ type: "simple-array", nullable: true })
  tags!: string[];

  @Column({ nullable: true })
  description?: string;

  @Column({ name: "short_description", nullable: true })
  shortDescription?: string;

  @Column({ name: "enable_review", type: "boolean", default: true })
  enableReview?: boolean;

  @Column({ name: "user_id" })
  userId!: number;
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

  @OneToMany(
    (_type) => ProductVariantEntity,
    (productVaritant) => productVaritant.product
  )
  productVariants!: ProductVariantEntity[];

  @OneToMany(
    (_type) => ProductCategoryEntity,
    (productCategory) => productCategory.product
  )
  productCategories!: ProductCategoryEntity[];

  @OneToMany((_type) => WishListEntity, (wishList) => wishList.product)
  wishlists!: WishListEntity[];

  @OneToMany((_type) => OrderItemEntity, (items) => items.product)
  orderItems!: OrderItemEntity[];
}
