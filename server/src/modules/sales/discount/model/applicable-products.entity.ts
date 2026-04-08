import { ProductEntity } from '@/modules/catalog/products/product/model/product.entity';
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

@Entity('applicable_products')
export class ApplicableProductEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index('IDX_APPLICABLE_PRODUCT_ID')
  @Column({ name: 'product_id' })
  productId!: number;
  @ManyToOne((_type) => ProductEntity, (product) => product.applicableProducts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product!: ProductEntity;

  @Index('IDX_APPLICABLE_DISCOUNT_PROD_ID')
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
