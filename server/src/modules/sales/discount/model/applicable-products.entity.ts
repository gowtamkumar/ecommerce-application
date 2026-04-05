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
import { ProductEntity } from '@/modules/catalog/products/product/model/product.entity';
import { DiscountEntity } from './discount.entity';

@Entity('applicable_products')
export class ApplicableProductEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'product_id' })
  productId!: number;
  @ManyToOne((_type) => ProductEntity, (product) => product.applicableProducts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product!: ProductEntity;

  @Column({ name: 'discount_id' })
  discountId?: number;
  @ManyToOne((_type) => DiscountEntity, (discount) => discount.applicableProducts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'discount_id' })
  discount!: DiscountEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt?: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt?: string;
}
