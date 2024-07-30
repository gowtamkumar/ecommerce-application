import "reflect-metadata";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DivisionEntity } from "../../geo-location/divisions/model/division.entity";

@Entity("shipping_charges")
export class ShippingChargeEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "division_id", unique: true })
  divisionId!: number;
  @ManyToOne(
    (_type) => DivisionEntity,
    (division) => division.shippingCharges,
    {
      onDelete: "CASCADE",
    }
  )
  @JoinColumn({ name: "division_id" })
  division!: DivisionEntity;

  @Column({ name: "shipping_amount", type: "numeric", precision: 15, scale: 2 })
  shippingAmount!: number;

  @Column({ nullable: true })
  note!: string;

  @Column({ name: "user_id" })
  userId!: number;

  @Column({ type: "boolean", default: true })
  status!: boolean;
}
