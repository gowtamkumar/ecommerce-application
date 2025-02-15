import "reflect-metadata";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderEntity } from "../../order/model/order.entity";

@Entity("status")
export class StatusEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @OneToMany(
    (_type) => OrderEntity,
    (status) => status.status
  )
  orders!: OrderEntity[];
}
