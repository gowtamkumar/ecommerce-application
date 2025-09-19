// import "reflect-metadata";
// import {
//   Column,
//   CreateDateColumn,
//   Entity,
//   JoinColumn,
//   ManyToOne,
//   OneToMany,
//   PrimaryGeneratedColumn,
//   UpdateDateColumn,
// } from "typeorm";
// import { ReturnStatus } from "../enums/return-status.enum";
// import { OrderItemEntity } from "../../order/model/order-item.entity";
// @Entity("returns")
// export class ReturnEntity {
//   @PrimaryGeneratedColumn()
//   id!: number;

//   @Column({ name: "order_id" })
//   orderId!: number;

//   @Column({ name: "order_item_id" })
//   orderItemId!: number;
//   @ManyToOne(() => OrderItemEntity, (orderItem) => orderItem.returns, {
//     onDelete: "CASCADE",
//   })
//   @JoinColumn({ name: "order_item_id" })
//   orderItem!: OrderItemEntity;

//   @Column({ nullable: true })
//   reason!: string;

//   @Column({ name: "requested_qty", type: "int", default: 0 })
//   requestedQty!: number;

//   @Column({ name: "approved_qty", type: "int", default: 0 })
//   approvedQty!: number;

//   @Column({ nullable: true })
//   phone!: string;

//   @Column({ nullable: true })
//   image!: string;

//   @Column({ type: "enum", enum: ReturnStatus, default: ReturnStatus.Requested })
//   status!: ReturnStatus;

//   @Column({ name: "user_id" })
//   userId!: number;
//   // @ManyToOne(() => UserEntity, (user) => user.returns, {
//   //   onDelete: "CASCADE",
//   // })
//   // @JoinColumn({ name: "user_id" })
//   // user!: UserEntity;

//   @CreateDateColumn({ name: "requested_at", type: "timestamptz" })
//   requestedAt?: string;

//   @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
//   updatedAt?: string;
// }
