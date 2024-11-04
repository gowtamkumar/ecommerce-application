import "reflect-metadata";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { MenuStatus } from "../enums/menu-status.enum";

@Entity("menus")
export class MenuEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: "simple-json", nullable: true })
  items!: string;

  // @Column({ nullable: true })
  // image!: string;

  @Column({
    type: "enum",
    enum: MenuStatus,
    default: MenuStatus.Inactive,
  })
  status!: MenuStatus;

  @Column({ name: "user_id" })
  userId!: number;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt?: string;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt?: string;
}
