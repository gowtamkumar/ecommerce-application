import { BrandEntity } from '@/modules/catalog/brand/model/brand.entity';
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

@Entity('applicable_brands')
export class ApplicableBrandEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index('IDX_APPLICABLE_BRAND_ID')
  @Column({ name: 'brand_id' })
  brandId!: number;
  @ManyToOne((_type) => BrandEntity, (item) => item.applicableBrands, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'brand_id' })
  brand!: BrandEntity;

  @Index('IDX_APPLICABLE_DISCOUNT_BRAND_ID')
  @Column({ name: 'discount_id' })
  discountId!: number;
  @ManyToOne((_type) => DiscountEntity, (item) => item.applicableBrands, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'discount_id' })
  discount!: DiscountEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt?: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt?: string;
}
