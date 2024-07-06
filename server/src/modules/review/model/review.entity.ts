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
import { reviewStatusEnum } from "../enums/review.status.enum";
import { ProductEntity } from "../../product/model/product.entity";

@Entity("reviews")
export class ReviewEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "product_id", nullable: true })
  productId!: number;
  @ManyToOne((_type) => ProductEntity, (product) => product.reviews)
  @JoinColumn({ name: "product_id" })
  product!: ProductEntity;

  @Column({ nullable: true })
  rating!: string;

  @Column({ nullable: true })
  comment!: string;

  @Column({
    type: "enum",
    enum: reviewStatusEnum,
    default: reviewStatusEnum.Pending,
  })
  status!: reviewStatusEnum;

  @Column({ name: "user_id" })
  userId!: number;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt?: string;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt?: string;
}
