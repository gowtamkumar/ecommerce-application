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
