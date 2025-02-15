import "reflect-metadata";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DistrictEntity } from "../../districts/model/district.entity";
import { ShippingChargeEntity } from "../../../../shipping-charge/model/shipping-charge.entity";
import { ShippingAddressEntity } from "../../../../shipping-address/model/shipping-address.entity";

@Entity("divisions")
export class DivisionEntity {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  name!: string;

  @Column({ name: "bn_name" })
  bnName!: string;

  @Column()
  url!: string;

  @OneToMany((_type) => DistrictEntity, (district) => district.division)
  districts!: DistrictEntity[];

  @OneToMany(
    (_type) => ShippingChargeEntity,
    (shippingCharge) => shippingCharge.division
  )
  shippingCharges!: ShippingChargeEntity[];

  @OneToMany(
    (_type) => ShippingAddressEntity,
    (shippingAddress) => shippingAddress.division
  )
  shippingAddress!: ShippingAddressEntity[];
}
