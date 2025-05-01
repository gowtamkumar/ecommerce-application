import "reflect-metadata";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("stock_adjust")
export class StockAdjustEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  productId!: number;

  @Column()
  variantId!: number;

  @Column()
  qty!: number;

  @Column({ name: "user_id" })
  userId!: number;
}
