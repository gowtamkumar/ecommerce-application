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
import { ProductCategoryEntity } from "../../products/product-category/model/product-category.entity";
import { PostCategoryEntity } from "../../blog/post/model/post-category.entity";
import { ApplicableCategoryEntity } from "../../discount/model/applicable-category.entity";

@Entity("categories")
@Tree("materialized-path")
export class CategoriesEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  name!: string;

  @Column()
  slug!: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ nullable: true })
  level!: number;

  @Column({ nullable: true })
  description?: string;

  @Column({
    type: "boolean",
    default: true,
  })
  active!: boolean;

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

  // @OneToMany(
  //   (_type) => PostCategoryEntity,
  //   (productCategory) => productCategory.category
  // )
  // postCategories!: PostCategoryEntity[];

  @OneToMany(
    (_type) => ApplicableCategoryEntity,
    (apCategory) => apCategory.category
  )
  applicableCategories!: ApplicableCategoryEntity[];
}
