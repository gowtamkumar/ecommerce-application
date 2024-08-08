import "reflect-metadata";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserEntity } from "./user.entity";

@Entity("user_activities")
export class UserActivityEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  // @Column({})
  // type!: string;

  @Column({name: "user_id"})
  userId!: number;
  @ManyToOne((_type) => UserEntity, (user) => user.userActivities)
  @JoinColumn({ name: "user_id" })
  user?: UserEntity;

  @Column()
  timestamp?: string;
}
