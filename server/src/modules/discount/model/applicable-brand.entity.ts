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
import { DiscountEntity } from "./discount.entity";
import { BrandEntity } from "../../brand/model/brand.entity";

@Entity("applicable_brands")
export class ApplicableBrandEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "brand_id" })
  brandId!: number;
  @ManyToOne((_type) => BrandEntity, (item) => item.applicableBrands, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "brand_id" })
  brand!: BrandEntity;

  @Column({ name: "discount_id" })
  discountId!: number;
  @ManyToOne((_type) => DiscountEntity, (item) => item.applicableBrands, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "discount_id" })
  discount!: DiscountEntity;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt?: string;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt?: string;
}
