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
import { ProductEntity } from "../../product/model/product.entity";
import { UserEntity } from "../../auth/model/user.entity";

@Entity("wishlists")
export class WishListEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "product_id" })
  productId!: number;
  @ManyToOne((_type) => ProductEntity, (product) => product.wishlists, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "product_id" })
  product!: ProductEntity;

  @Column({ name: "user_id" })
  userId!: number;
  @ManyToOne((_type) => UserEntity, (user) => user.wishlists, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt!: string;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt!: string;
}
