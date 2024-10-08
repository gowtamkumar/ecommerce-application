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
import { PostStatus } from "../enums";
import { UserEntity } from "../../auth/model/user.entity";
import { PostCategoryEntity } from "./post-category.entity";
import { CommentEntity } from "../../comment/model/comment.entity";

@Entity("posts")
export class PostEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  // @Column()
  // slug!: string;

  @Column()
  title!: string;

  @Column()
  image!: string;

  @Column({ type: "simple-array", nullable: true })
  tags!: string[];

  @Column()
  content!: string;

  @Column({ name: "user_id" })
  userId!: number;
  @ManyToOne((_type) => UserEntity, (user) => user.posts, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;

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

  @OneToMany((_type) => PostCategoryEntity, (postCategory) => postCategory.post)
  postCategories!: PostCategoryEntity[];

  @OneToMany((_type) => CommentEntity, (comment) => comment.post)
  comments!: CommentEntity[];
}
