import 'reflect-metadata';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DiscountEntity } from './discount.entity';
import { CategoriesEntity } from '../../categories/model/categories.entity';

@Entity('applicable_categories')
export class ApplicableCategoryEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'category_id' })
  categoryId!: number;
  @ManyToOne((_type) => CategoriesEntity, (item) => item.applicableCategories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category!: CategoriesEntity;

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
