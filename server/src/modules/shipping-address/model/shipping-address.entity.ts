import "reflect-metadata";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AddressType } from "../enums/address-type.enum";
import { UserEntity } from "../../auth/model/user.entity";
import { OrderEntity } from "../../order/model/order.entity";
import { DivisionEntity } from "../../other/geo-location/divisions/model/division.entity";
import { DistrictEntity } from "../../other/geo-location/districts/model/district.entity";
import { UpazilaEntity } from "../../other/geo-location/upazilas/model/upazila.entity";
import { UnionEntity } from "../../other/geo-location/unions/model/union.entity";

@Entity("shipping_addresses")
export class ShippingAddressEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "enum", enum: AddressType })
  type!: AddressType;

  @Column()
  name!: string;

  @Column({ name: "phone_no" })
  phoneNo!: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ name: "alternative_phone_no", nullable: true })
  alternativePhoneNo?: string;

  @Column({ name: "country" })
  country!: string;

  @Column({ name: "division_id", nullable: true })
  divisionId!: number;
  @ManyToOne((_type) => DivisionEntity, (division) => division.shippingAddress, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "division_id" })
  division!: DivisionEntity;

  @Column({ name: "district_id", nullable: true })
  districtId!: number;
  @ManyToOne((_type) => DistrictEntity, (district) => district.shippingAddress, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "district_id" })
  district!: DistrictEntity;

  @Column({ name: "upazila_id", nullable: true })
  upazilaId!: number;
  @ManyToOne((_type) => UpazilaEntity, (upazila) => upazila.shippingAddress, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "upazila_id" })
  upazila!: UpazilaEntity;

  @Column({ name: "union_id", nullable: true })
  unionId!: number;
  @ManyToOne((_type) => UnionEntity, (union) => union.shippingAddress, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "union_id" })
  union!: UnionEntity;

  @Column()
  address!: string;

  @Column({ name: "user_id" })
  userId!: number;
  @ManyToOne((_type) => UserEntity, (user) => user.shippingAddress, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;

  @Column({ type: "boolean", default: true })
  status!: boolean;

  // @CreateDateColumn({ name: "created_at",type: "timestamp" })
  // createdAt?: string;

  // @UpdateDateColumn({ name: "updated_at",type: "timestamp" })
  // updatedAt?: string;

  @OneToMany((_type) => OrderEntity, (order) => order.shippingAddress)
  orders!: OrderEntity[];
}
