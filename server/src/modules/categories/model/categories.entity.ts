import "reflect-metadata";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
  UpdateDateColumn,
} from "typeorm";
import { CategoryStatus } from "../enums/category-status.enum";
import { ProductCategoryEntity } from "../../product-category/model/product-category.entity";

@Entity("categories")
@Tree("materialized-path")
export class CategoriesEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  name!: string;

  @Column({ name: "url_slug", nullable: true })
  urlSlug!: string;

  // @Column({ name: "parent_id", nullable: true })
  // parentId!: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ nullable: true })
  level!: number;

  @Column({ nullable: true })
  description?: string;

  @Column({
    type: "enum",
    enum: CategoryStatus,
    default: CategoryStatus.Active,
  })
  status!: CategoryStatus;

  @TreeChildren()
  children!: CategoriesEntity[];

  @TreeParent({ onDelete: "CASCADE" })
  parent!: CategoriesEntity;

  @Column({ name: "user_id" })
  userId!: number;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt?: string;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt?: string;

  @OneToMany(
    (_type) => ProductCategoryEntity,
    (productCategory) => productCategory.category
  )
  productCategories!: ProductCategoryEntity[];
}
