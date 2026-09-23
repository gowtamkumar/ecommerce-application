import { OrderEntity } from '@/modules/sales/order/model/order.entity';
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
import { OrderTrackingStatusEnum } from '../enums/order-tracking-status.enum';

@Index('idx_order_trackings_order_id', ['orderId'])
@Entity('order_trackings')
export class OrderTrackingEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'order_id' })
  orderId!: number;
  @ManyToOne((_type) => OrderEntity, (order) => order.orderTrackings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order!: OrderEntity;

  @Column({ name: 'user_id', nullable: true })
  userId!: number;

  @Column({ nullable: true })
  location!: string;

  @Column({
    type: 'enum',
    enum: OrderTrackingStatusEnum,
    default: OrderTrackingStatusEnum.OrderPlaced,
  })
  status!: OrderTrackingStatusEnum;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt?: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt?: string;
}
