import "reflect-metadata";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { BrandStatus } from "../enums/brand-status.enum";
import { ProductEntity } from "../../product/model/product.entity";

@Entity("brands")
export class BrandEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column({
    type: "enum",
    enum: BrandStatus,
    default: BrandStatus.Active,
  })
  status!: BrandStatus;

  @Column({ name: "user_id" })
  userId!: number;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt?: string;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt?: string;

  @OneToMany((_type) => ProductEntity, (product) => product.brand)
  products!: ProductEntity[];
}
