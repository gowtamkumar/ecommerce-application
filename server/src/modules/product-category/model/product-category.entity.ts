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

  @Column({ name: "category_id" })
  categoryId?: number;
  @ManyToOne(
    (_type) => CategoriesEntity,
    (category) => category.productCategories
  )
  @JoinColumn({ name: "category_id" })
  category!: CategoriesEntity;

  @Column({ name: "product_id" })
  productId?: number;
  @ManyToOne((_type) => ProductEntity, (product) => product.productCategories, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "product_id" })
  product!: ProductEntity;
}
