import "reflect-metadata";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ProductEntity } from "../../product/model/product.entity";
import { CategoriesEntity } from "../../categories/model/categories.entity";

@Entity("product_categories")
export class ProductCategoryEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "category_id", nullable: true })
  categoryId?: string;
  @ManyToOne(
    (_type) => CategoriesEntity,
    (category) => category.productCategories
  )
  @JoinColumn({ name: "category_id" })
  category!: CategoriesEntity;

  @Column({ name: "product_id", nullable: true })
  productId?: string;
  @ManyToOne((_type) => ProductEntity, (product) => product.productCategories,  { onDelete: "CASCADE" })
  @JoinColumn({ name: "product_id" })
  product!: ProductEntity;
}
