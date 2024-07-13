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
import { UserEntity } from "../../auth/model/user.entity";

@Entity("reviews")
export class ReviewEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "product_id" })
  productId!: number;
  @ManyToOne((_type) => ProductEntity, (product) => product.reviews)
  @JoinColumn({ name: "product_id" })
  product!: ProductEntity;

  @Column()
  rating!: string;

  @Column({ nullable: true })
  comment!: string;

  @Column({ nullable: true })
  like!: number;

  @Column({ nullable: true })
  dislike!: number;

  @Column({
    type: "enum",
    enum: reviewStatusEnum,
    default: reviewStatusEnum.Pending,
  })
  status!: reviewStatusEnum;

  @Column({ name: "user_id" })
  userId!: number;
  @ManyToOne((_type) => UserEntity, (user) => user.reviews)
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt?: string;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt?: string;
}
