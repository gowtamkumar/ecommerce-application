import "reflect-metadata";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ProductEntity } from "../../products/product/model/product.entity";
import { DiscountType } from "../../../enums/discount-type.enum";
import { Status } from "../../../enums/status.enum";

@Entity("discounts")
export class DiscountEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  name!: string;

  @Column({ name: "discount_type", type: "enum", enum: DiscountType })
  discountType!: DiscountType;

  @Column()
  value!: number;

  @Column({ nullable: true })
  image!: string;

  @Column({ type: "enum", enum: Status, default: Status.Active })
  status!: Status;

  @Column({ name: "user_id" })
  userId?: number;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt?: string;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt?: string;

  @OneToMany((_type) => ProductEntity, (product) => product.discount)
  products!: ProductEntity[];
}


//     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//     scope VARCHAR(20) CHECK (scope IN ('product', 'category', 'brand')), -- Defines what it applies to
//     discount_type VARCHAR(20) CHECK (discount_type IN ('discount', 'offer')),
//     discount_method VARCHAR(20) CHECK (discount_method IN ('percentage', 'fixed', 'free_shipping', 'bogo', 'free_gift', 'cashback')),
//     offer_details JSONB,  -- Store additional details about the offer (for complex offers like BOGO, Free Gift)
//     name VARCHAR(100) NOT NULL,
//     code VARCHAR(50) UNIQUE,  -- Coupon Code (if applicable)
//     value DECIMAL(10,2),  -- Discount value (percentage or fixed amount)
//     start_date TIMESTAMP,
//     expiry_date TIMESTAMP,
//     min_order_amount DECIMAL(10,2),  -- Minimum order amount for discount/offer
//     max_discount_value DECIMAL(10,2),  -- Maximum discount allowed
//     usage_limit INT,  -- Total times this discount can be used
//     usage_per_user INT,  -- How many times a user can use this discount
//     max_users INT,  -- Maximum number of users who can use this discount
//     usage_count INT DEFAULT 0,  -- Total number of times the discount has been used
//     applicable_products UUID[],  -- Array of applicable product IDs (optional)
//     applicable_categories UUID[],  -- Array of applicable category IDs (optional)
//     applicable_brands UUID[],  -- Array of applicable brand IDs (optional)
//     shipping_discount BOOLEAN DEFAULT FALSE,  -- Free shipping flag (if applicable)
//     free_gift BOOLEAN DEFAULT FALSE,  -- Free gift flag (if applicable)
//     status BOOLEAN DEFAULT TRUE,  -- Whether the discount is active or not
//     created_at TIMESTAMP DEFAULT NOW(),
//     updated_at TIMESTAMP DEFAULT NOW()

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
