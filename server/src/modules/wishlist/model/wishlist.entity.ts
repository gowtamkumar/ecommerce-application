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

@Entity("wishlists")
export class WishListEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "product_id" })
  productId!: number;
  @ManyToOne((_type) => ProductEntity, (product) => product.wishlists,  { onDelete: "CASCADE" })
  @JoinColumn({ name: "product_id" })
  product!: ProductEntity;

  @Column({ name: "user_id", nullable: true })
  userId!: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt!: string;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt!: string;
}
