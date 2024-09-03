import "reflect-metadata";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { PostStatus } from "../enums";

@Entity("posts")
export class PostEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  // @Column()
  // slug!: string;

  @Column()
  title!: string;

  @Column()
  image!: number;

  @Column({ type: "simple-array", nullable: true })
  tags!: string[];

  @Column()
  content!: string;

  @Column({ name: "user_id" })
  userId!: number;
  // @ManyToOne((_type) => UserEntity, (user) => user.orders, {
  //   onDelete: "CASCADE",
  // })
  // @JoinColumn({ name: "user_id" })
  // user!: UserEntity;

  @Column({
    type: "enum",
    enum: PostStatus,
    default: PostStatus.Draft,
  })
  status!: PostStatus;
  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt?: string;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp with time zone" })
  updatedAt?: string;

  // @OneToMany((_type) => OrderItemEntity, (product) => product.order)
  // orderItems!: OrderItemEntity[];
}
