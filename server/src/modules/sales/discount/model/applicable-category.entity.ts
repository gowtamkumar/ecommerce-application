import { CategoriesEntity } from '@/modules/catalog/categories/model/categories.entity';
import 'reflect-metadata';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DiscountEntity } from './discount.entity';

@Entity('applicable_categories')
export class ApplicableCategoryEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index('IDX_APPLICABLE_CATEGORY_ID')
  @Column({ name: 'category_id' })
  categoryId!: number;
  @ManyToOne((_type) => CategoriesEntity, (item) => item.applicableCategories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category!: CategoriesEntity;

  @Index('IDX_APPLICABLE_DISCOUNT_CAT_ID')
  @Column({ name: 'discount_id' })
  discountId?: number;
  @ManyToOne((_type) => DiscountEntity, (item) => item.applicableCategories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'discount_id' })
  discount!: DiscountEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt?: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt?: string;
}
