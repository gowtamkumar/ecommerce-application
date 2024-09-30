import "reflect-metadata";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PostEntity } from "./post.entity";
import { CategoriesEntity } from "../../categories/model/categories.entity";

@Entity("post_categories")
export class PostCategoryEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "post_id" })
  postId!: number;
  @ManyToOne((_type) => PostEntity, (order) => order.postCategories, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "post_id" })
  post!: PostEntity;

  @Column({ name: "category_id" })
  categoryId!: number;
  @ManyToOne((_type) => CategoriesEntity, (category) => category.postCategories, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "category_id" })
  category!: CategoriesEntity;

}
