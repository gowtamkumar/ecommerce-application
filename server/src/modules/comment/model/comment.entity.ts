import "reflect-metadata";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { commentStatusEnum } from "../enums/comment.status.enum";
import { UserEntity } from "../../auth/model/user.entity";
import { PostEntity } from "../../post/model/post.entity";

@Entity("comments")
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "post_id" })
  postId!: number;
  @ManyToOne((_type) => PostEntity, (post) => post.comments, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "post_id" })
  post!: PostEntity;

  @Column({ nullable: true })
  content!: string;

  @Column({ nullable: true })
  like!: number;

  @Column({ name: "dis_like", nullable: true })
  disLike!: number;

  @Column({
    type: "enum",
    enum: commentStatusEnum,
    default: commentStatusEnum.Pending,
  })
  status!: commentStatusEnum;

  @Column({ name: "user_id" })
  userId!: number;
  @ManyToOne((_type) => UserEntity, (user) => user.comments)
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt?: string;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt?: string;
}
