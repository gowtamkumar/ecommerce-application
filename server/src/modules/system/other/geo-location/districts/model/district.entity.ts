import 'reflect-metadata';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ShippingAddressEntity } from '@/modules/sales/shipping-address/model/shipping-address.entity';
import { ShippingChargeEntity } from '@/modules/sales/shipping-charge/model/shipping-charge.entity';
import { DivisionEntity } from '@/modules/system/other/geo-location/divisions/model/division.entity';
import { UpazilaEntity } from '@/modules/system/other/geo-location/upazilas/model/upazila.entity';

@Entity('districts')
export class DistrictEntity {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({ name: 'division_id', nullable: true })
  divisionId!: number;
  @ManyToOne((_type) => DivisionEntity, (division) => division.districts)
  @JoinColumn({ name: 'division_id' })
  division!: DivisionEntity;

  @Column()
  name!: string;

  @Column({ name: 'bn_name' })
  bnName!: string;

  @Column()
  lat!: string;

  @Column()
  lon!: string;

  @Column({ nullable: true })
  url!: string;

  @OneToMany((_type) => UpazilaEntity, (upazila) => upazila.district)
  upazilas!: UpazilaEntity[];

  @OneToMany((_type) => ShippingChargeEntity, (shippingCharge) => shippingCharge.district)
  shippingCharges!: ShippingChargeEntity[];

  @OneToMany((_type) => ShippingAddressEntity, (shippingAddress) => shippingAddress.district)
  shippingAddress!: ShippingAddressEntity[];
}
