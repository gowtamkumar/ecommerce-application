import "reflect-metadata";
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ProductEntity } from "../../products/product/model/product.entity";
import { Status } from "../../../enums/status.enum";
import { DiscountStrategyEnum, PromotionTypeEnum, ScopeEnum } from "../enum";
import { ApplicableBrandEntity } from "./applicable-brand.entity";
import { ApplicableCategoryEntity } from "./applicable-category.entity";
import { ApplicableProductEntity } from "./applicable-products.entity";

@Entity("discounts")
export class DiscountEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ length: 50, unique: true, nullable: true }) // should be auto generate
  key!: string;

  @Column({ type: "enum", enum: ScopeEnum })
  scope!: ScopeEnum;

  @Column({ name: "promotion_type", type: "enum", enum: PromotionTypeEnum })
  promotionType!: PromotionTypeEnum;

  @Column({
    name: "discount_strategy",
    type: "enum",
    enum: DiscountStrategyEnum,
  })
  discountStrategy!: DiscountStrategyEnum;

  @Column({ name: "offer_details", type: "jsonb", nullable: true })
  offerDetails!: Record<string, any>;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  value!: number;

  @Column({
    name: "start_date",
    type: "timestamp with time zone",
    nullable: true,
  })
  startDate!: string;

  @Column({
    name: "end_date",
    type: "timestamp with time zone",
    nullable: true,
  })
  endDate!: string;

  @Column({ type: "int", default: 1 })
  priority!: number; // Higher number = Higher priority for applied first

  @Column({ type: "boolean", default: false })
  stackable!: boolean; // If true, this discount can be combined with others

  @Column({ type: "enum", enum: Status, default: Status.Active })
  status!: Status;

  @Column({ nullable: true })
  image!: string;

  @Column({ nullable: true })
  description!: string;


  @Column({ name: "user_id" })
  userId?: number;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt?: string;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt?: string;

  @OneToMany((_type) => ProductEntity, (item) => item.discount)
  products!: ProductEntity[];

  @OneToMany((_type) => ApplicableBrandEntity, (item) => item.discount)
  applicableBrands!: ApplicableBrandEntity[];

  @OneToMany((_type) => ApplicableCategoryEntity, (item) => item.discount)
  applicableCategories!: ApplicableCategoryEntity[];

  @OneToMany((_type) => ApplicableProductEntity, (item) => item.discount)
  applicableProducts!: ApplicableProductEntity[];
  
  @BeforeInsert()
  generateCode() {
    if (!this.key) {
      this.key = `DISC-${Math.random()
        .toString(36).toUpperCase()}`;
    }
  }
}

// id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
// scope VARCHAR(20) CHECK (scope IN ('product', 'products', 'category', 'brand')), -- Defines what it applies to
// promotion_type VARCHAR(20) CHECK (promotion_type IN ('discount', 'offer', 'coupon', 'flash_sale', 'seasonal', 'membership')), -- Defines the type of discount
// discount_strategy VARCHAR(20) CHECK (discount_strategy IN ('percentage', 'fixed', 'free_shipping', 'bogo', 'free_gift', 'cashback')),
// offer_details JSONB,  -- Store additional details about the offer (for complex offers like BOGO, Free Gift)
// name VARCHAR(100) NOT NULL,
// code VARCHAR(50) UNIQUE,  -- Coupon Code (if applicable)
// value DECIMAL(10,2),  -- Discount value (percentage or fixed amount)
// start_date TIMESTAMP,
// expiry_date TIMESTAMP,
// min_order_amount DECIMAL(10,2),  -- Minimum order amount for discount/offer
// max_discount_value DECIMAL(10,2),  -- Maximum discount allowed
// usage_limit INT,  -- Total times this discount can be used
// usage_per_user INT,  -- How many times a user can use this discount
// max_users INT,  -- Maximum number of users who can use this discount
// usage_count INT DEFAULT 0,  -- Total number of times the discount has been used
// applicable_products UUID[],  -- Array of applicable product IDs (optional)
// applicable_categories UUID[],  -- Array of applicable category IDs (optional)
// applicable_brands UUID[],  -- Array of applicable brand IDs (optional)
// shipping_discount BOOLEAN DEFAULT FALSE,  -- Free shipping flag (if applicable)
// free_gift BOOLEAN DEFAULT FALSE,  -- Free gift flag (if applicable)
// status BOOLEAN DEFAULT TRUE,  -- Whether the discount is active or not
// created_at TIMESTAMP DEFAULT NOW(),
// updated_at TIMESTAMP DEFAULT NOW()

//     offer_details:
//     {
//       "offer_type": "bogo",
//       "free_product_id": "12345",  -- The product that will be free
//       "min_quantity_for_offer": 2   -- Minimum quantity of the main product to trigger the offer
//   }
//   {
//     "offer_type": "free_shipping",
//     "minimum_order_amount": 50  -- Minimum order amount required for free shipping
// }

// {
//   "offer_type": "free_gift",
//   "gift_product_id": "67890"  -- The ID of the free gift product
// }

// {
//   "offer_type": "cashback",
//   "cashback_amount": 10.00  -- Cashback amount
// }
