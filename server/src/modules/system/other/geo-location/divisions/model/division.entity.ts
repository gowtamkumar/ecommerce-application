import 'reflect-metadata';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ShippingAddressEntity } from '@/modules/sales/shipping-address/model/shipping-address.entity';
import { DistrictEntity } from '@/modules/system/other/geo-location/districts/model/district.entity';

@Entity('divisions')
export class DivisionEntity {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  name!: string;

  @Column({ name: 'bn_name' })
  bnName!: string;

  @Column()
  url!: string;

  @OneToMany((_type) => DistrictEntity, (district) => district.division)
  districts!: DistrictEntity[];

  @OneToMany((_type) => ShippingAddressEntity, (shippingAddress) => shippingAddress.division)
  shippingAddress!: ShippingAddressEntity[];
}
