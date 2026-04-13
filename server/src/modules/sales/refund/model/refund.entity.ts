import { OrderEntity } from '@/modules/sales/order/model/order.entity';
import { UserEntity } from '@/modules/user/auth/model/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RefundMethod } from '../enums/refund-method.enum';
import { RefundStatus } from '../enums/refund-status.enum';

@Entity('refunds')
export class RefundEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'order_id' })
  orderId!: number;

  @ManyToOne(() => OrderEntity)
  @JoinColumn({ name: 'order_id' })
  order!: OrderEntity;

  @Column({ name: 'user_id' })
  userId!: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  amount!: number;

  @Column({
    type: 'enum',
    enum: RefundStatus,
    default: RefundStatus.Pending,
  })
  status!: RefundStatus;

  @Column({
    name: 'payment_method',
    type: 'enum',
    enum: RefundMethod,
    default: RefundMethod.Manual,
  })
  paymentMethod!: RefundMethod;

  @Column({ name: 'transaction_id', nullable: true })
  transactionId?: string;

  @Column({ type: 'text', nullable: true })
  reason?: string;

  @Column({ type: 'text', nullable: true })
  note?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt?: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt?: string;
}
