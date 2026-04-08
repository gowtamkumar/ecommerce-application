import { ColorEntity } from '@/modules/catalog/color/model/color.entity';
import { ProductEntity } from '@/modules/catalog/products/product/model/product.entity';
import { SizeEntity } from '@/modules/catalog/size/model/size.entity';
import { CartEntity } from '@/modules/sales/cart/model/cart.entity';
import { OrderItemEntity } from '@/modules/sales/order/model/order-item.entity';
import 'reflect-metadata';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('product_variants')
export class ProductVariantEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true }) //need to change this nullable true
  sku!: string;

  @Column({
    name: 'unit_price',
    type: 'numeric',
    precision: 15,
    scale: 2,
  })
  unitPrice!: number;

  @Column({
    name: 'purchase_price',
    type: 'numeric',
    precision: 15,
    scale: 2,
  })
  purchasePrice!: number;

  @Index()
  @Column({ name: 'product_id' })
  productId!: number;
  @ManyToOne((_type) => ProductEntity, (product) => product.productVariants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product!: ProductEntity;

  @Column({ name: 'size_id', nullable: true })
  sizeId?: number;
  @ManyToOne((_type) => SizeEntity, (size) => size.productVariants, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'size_id' })
  size!: SizeEntity;

  @Column({ name: 'color_id', nullable: true })
  colorId?: number;
  @ManyToOne((_type) => ColorEntity, (color) => color.productVariants, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'color_id' })
  color!: ColorEntity;

  @Column({ nullable: true })
  material!: string;

  @Column({ nullable: true })
  image!: string;

  @Column({ type: 'boolean', default: false })
  default?: boolean;

  @Column({ name: 'stock_qty' })
  stockQty?: number;

  @OneToMany((_type) => OrderItemEntity, (items) => items.productVariant)
  orderItems!: OrderItemEntity[];

  @OneToMany((_type) => CartEntity, (cart) => cart.productVariant)
  carts!: CartEntity[];
}
