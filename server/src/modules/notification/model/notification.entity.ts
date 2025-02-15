import "reflect-metadata";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "../../auth/model/user.entity";

@Entity("notifications")
export class NotificationEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  type!: string;

  @Column()
  message!: string;

  @Column({ name: "is_read", type: "boolean", default: false })
  isRead!: boolean;

  @Column({ name: "user_id" })
  userId!: number;
  @ManyToOne((_type) => UserEntity, (user) => user.notifications, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;

  @Column({ name: "order_id", nullable: true })
  orderId!: number;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt?: string;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp with time zone" })
  updatedAt?: string;
}

// 1. Order-Related Notifications
// Order Confirmation 📦
// Order Shipped 🚚
// Order Delivered ✅
// Order Canceled ❌
// Order Delayed ⏳
// Order Refund Processed 💰
// Payment Successful 🏦
// Payment Failed ❗

// 2. Promotional & Marketing Notifications
// Discount Offers & Coupons 🎉
// Flash Sales & Limited-Time Deals ⏳
// Personalized Recommendations 💡
// Abandoned Cart Reminder 🛒
// Back-in-Stock Alerts 🔄
// Price Drop Alerts 📉

// 3. User Account Notifications
// New User Registration ✅
// Password Change or Reset 🔑
// Account Security Alerts 🔐
// Subscription Renewal 📆
// Loyalty Program Updates 🌟
// 4. Review & Feedback Notifications
// Review Request ✍️
// Response to Review 📩
// Rating & Feedback Received ⭐
// 5. Customer Support Notifications
// Support Ticket Created 🎟️
// Response to Query 📢
// Chat Support Messages 💬
// 6. Wishlist & Subscription Notifications
// Wishlist Item Price Drop 💲
// Wishlist Item Back in Stock 🔔
// Subscription Expiration & Renewal 📅
// 7. Delivery Partner Notifications (If applicable)
// New Order Assignment 🏷️
// Pickup Scheduled 📦
// Delivery Confirmation ✅
