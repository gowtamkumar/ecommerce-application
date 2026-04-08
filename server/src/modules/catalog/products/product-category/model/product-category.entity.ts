import { CategoriesEntity } from '@/modules/catalog/categories/model/categories.entity';
import { ProductEntity } from '@/modules/catalog/products/product/model/product.entity';
import 'reflect-metadata';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('product_categories')
export class ProductCategoryEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index('idx_product_categories_category_id')
  @Column({ name: 'category_id' })
  categoryId?: number;
  @ManyToOne((_type) => CategoriesEntity, (category) => category.productCategories)
  @JoinColumn({ name: 'category_id' })
  category!: CategoriesEntity;

  @Index('idx_product_categories_product_id')
  @Column({ name: 'product_id' })
  productId?: number;
  @ManyToOne((_type) => ProductEntity, (product) => product.productCategories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product!: ProductEntity;
}
