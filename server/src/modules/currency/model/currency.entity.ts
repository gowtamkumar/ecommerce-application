import "reflect-metadata";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("currencies")
export class CurrencyEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  symbol!: string;

  @Column({ name: "user_id" })
  userId!: number;
}
