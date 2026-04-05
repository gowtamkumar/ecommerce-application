import 'reflect-metadata';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DistrictEntity } from '@/modules/system/other/geo-location/districts/model/district.entity';

@Entity('shipping_charges')
export class ShippingChargeEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'district_id', unique: true })
  districtId!: number;
  @ManyToOne((_type) => DistrictEntity, (district) => district.shippingCharges, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'district_id' })
  district!: DistrictEntity;

  @Column({ name: 'shipping_amount', type: 'numeric', precision: 15, scale: 2 })
  shippingCharge!: number;

  @Column({ nullable: true })
  note!: string;

  @Column({ name: 'user_id' })
  userId!: number;

  @Column({ type: 'boolean', default: true })
  status!: boolean;
}
