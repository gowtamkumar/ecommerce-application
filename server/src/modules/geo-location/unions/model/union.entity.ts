import "reflect-metadata";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UpazilaEntity } from "../../upazilas/model/upazila.entity";
import { ShippingAddressEntity } from "../../../shipping-address/model/shipping-address.entity";

@Entity("unions")
export class UnionEntity {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({ name: "upazilla_id", nullable: true })
  upazillaId!: number;
  @ManyToOne((_type) => UpazilaEntity, (Upazila) => Upazila.unions)
  @JoinColumn({ name: "upazilla_id" })
  upazilla!: UpazilaEntity;

  @Column()
  name!: string;

  @Column({ name: "bn_name" })
  bnName!: string;

  @Column({ nullable: true })
  url!: string;

  @OneToMany(
    (_type) => ShippingAddressEntity,
    (shippingAddress) => shippingAddress.union
  )
  shippingAddress!: ShippingAddressEntity[];
}
