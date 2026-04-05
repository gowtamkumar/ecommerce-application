import { ProductVariantEntity } from '@/modules/catalog/products/product-variant/model/product-variant.entity';
import { ProductEntity } from '@/modules/catalog/products/product/model/product.entity';
import { ReturnEntity } from '@/modules/sales/return/model/return.entity';
import 'reflect-metadata';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrderEntity } from './order.entity';

@Entity('order_items')
export class OrderItemEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'order_id' })
  orderId!: number;
  @ManyToOne((_type) => OrderEntity, (order) => order.orderItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order!: OrderEntity;

  @Column({
    name: 'unit_price',
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  unitPrice!: string;

  @Column({
    name: 'purchase_price',
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  purchasePrice!: string;

  @Column()
  qty!: number;

  // return
  @Column({ name: 'requested_qty', nullable: true })
  requestedQty!: number;

  @Column({ name: 'approved_qty', nullable: true })
  approvedQty!: number;

  @Column({
    name: 'tax_amount',
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  taxAmount!: string;

  @Column({
    name: 'discounted_unit_pice',
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  discountedUnitPrice!: string;

  @Column({
    name: 'total_discounted_price',
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  totalDiscountedPrice!: string;

  @Column({
    name: 'discount_amount_per_unit',
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  discountAmountPerUnit!: string;

  @Column({
    name: 'total_discount_amount',
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  totalDiscountAmount!: string;

  @Column({
    name: 'sub_total',
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  subTotal!: string; //need to remove nullable

  @Index()
  @Column({ name: 'product_id' })
  productId!: number;
  @ManyToOne((_type) => ProductEntity, (product) => product.orderItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product!: ProductEntity;

  @Column({ name: 'product_variant_id' })
  productVariantId!: number;
  @ManyToOne((_type) => ProductVariantEntity, (product) => product.orderItems, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'product_variant_id' })
  productVariant!: ProductVariantEntity;

  @OneToMany((_type) => ReturnEntity, (item) => item.orderItem)
  returns!: ReturnEntity[];
}
