import "reflect-metadata";
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("post_categories")
export class PostCategoryEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "post_id" })
  postId!: number;
  // @ManyToOne((_type) => BlogEntity, (order) => order.orderItems, {
  //   onDelete: "CASCADE",
  // })
  // @JoinColumn({ name: "order_id" })
  // order!: BlogEntity;

  @Column({ name: "category_id" })
  categoryId!: number;
}
