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
import { UserEntity } from "../../../auth/model/user.entity";
import { ReviewEntity } from "../../../review/model/review.entity";
import { ProductVariantEntity } from "../../product-variant/model/product-variant.entity";
import { TaxEntity } from "../../../tax/model/tax.entity";
import { BrandEntity } from "../../../brand/model/brand.entity";
import { ProductCategoryEntity } from "../../product-category/model/product-category.entity";
import { WishListEntity } from "../../../wishlist/model/wishlist.entity";
import { OrderItemEntity } from "../../../order/model/order-item.entity";
import { UnitEntity } from "../../../unit/model/unit.entity";
import { DiscountEntity } from "../../../discount/model/discount.entity";
import { Status } from "../../../../enums/status.enum";
import { CouponProductEntity } from "../../../coupon/model/coupon-product.entity";

@Entity("products")
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  // @Column({ unique: true }) //need to change this nullable true
  // sku!: string;

  @Column()
  slug!: string;

  @Column({ type: "boolean", default: false })
  variant?: boolean;

  @Column({ type: "boolean", default: false })
  featured?: boolean;

  @Column()
  description?: string;

  @Column({ name: "short_description" })
  shortDescription?: string;

  @Column({ name: "tax_id" })
  taxId?: number;
  @ManyToOne((_type) => TaxEntity, (tax) => tax.products)
  @JoinColumn({ name: "tax_id" })
  tax?: TaxEntity;

  @Column({ name: "discount_id", nullable: true })
  discountId?: number;
  @ManyToOne((_type) => DiscountEntity, (discount) => discount.products)
  @JoinColumn({ name: "discount_id" })
  discount?: DiscountEntity;

  @Column({ name: "enable_review", type: "boolean", default: true })
  enableReview?: boolean;

  @Column({ name: "limit_purchase_qty", nullable: true })
  limitPurchaseQty?: number;

  @Column({ name: "alert_qty" })
  alertQty!: number;

  // @Column({ name: "discount_type", type: "enum", enum: DiscountType })
  // discountType!: DiscountType;

  // @Column({ name: "discount_value" })
  // discountValue!: number;

  @Column({ type: "enum", enum: Status, default: Status.Active })
  status!: Status;

  @Column({ name: "brand_id", nullable: true })
  brandId?: number;
  @ManyToOne((_type) => BrandEntity, (brand) => brand.products)
  @JoinColumn({ name: "brand_id" })
  brand?: BrandEntity;

  @Column({ name: "unit_id" })
  unitId!: number;
  @ManyToOne((_type) => UnitEntity, (unit) => unit.products)
  @JoinColumn({ name: "unit_id" })
  unit!: UnitEntity;

  @Column({ type: "simple-array", nullable: true })
  tags!: string[];

  @Column({ name: "thumbnail_image", nullable: true }) //need to remove nullable
  thumbnailImage!: string;

  @Column({ name: "hover_image", nullable: true }) //need to remove nullable
  hoverImage!: string;

  @Column({ type: "simple-array" })
  images!: string[];

  @Column({ name: "user_id" })
  userId!: number;
  @ManyToOne((_type) => UserEntity, (user) => user.products)
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;

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

  @OneToMany((_type) => CouponProductEntity, (items) => items.product)
  couponProducts!: CouponProductEntity[];
}
