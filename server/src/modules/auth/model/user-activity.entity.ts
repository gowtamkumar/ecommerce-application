import "reflect-metadata";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("user_activities")
export class UserActivityEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  // @Column({})
  // type!: string;

  @Column()
  userId!: number;

  @Column()
  timestamp?: string;
}
