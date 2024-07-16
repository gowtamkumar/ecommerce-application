import "reflect-metadata";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AddressType } from "../enums/address-type.enum";
import { UserEntity } from "../../auth/model/user.entity";
import { OrderEntity } from "../../order/model/order.entity";

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

  @Column()
  city!: string;

  @Column()
  thana!: string;

  @Column()
  union!: string;

  @Column({ name: "zip_code", nullable: true })
  zipCode?: string;

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
