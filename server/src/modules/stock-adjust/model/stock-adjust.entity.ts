import 'reflect-metadata';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { StockAdjustTypeEnum } from '../enum/stock-adjust-type.status.enum';
import { ProductEntity } from '../../products/product/model/product.entity';

@Entity('stock_adjusts')
export class StockAdjustEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'product_id' })
  productId!: number;
  @ManyToOne((_type) => ProductEntity, (product) => product.stockAdjusts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product!: ProductEntity;

  @Column({ type: 'enum', enum: StockAdjustTypeEnum })
  type!: StockAdjustTypeEnum;

  @Column({ name: 'product_variant_id' })
  productVariantId!: number;

  @Column()
  qty!: number;

  @Column({ name: 'user_id' })
  userId!: number;
}
