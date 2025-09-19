import 'reflect-metadata';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ShippingAddressEntity } from '../../../../shipping-address/model/shipping-address.entity';
import { UpazilaEntity } from '../../upazilas/model/upazila.entity';

@Entity('unions')
export class UnionEntity {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({ name: 'upazila_id', nullable: true })
  upazilaId!: number;
  @ManyToOne((_type) => UpazilaEntity, (upazila) => upazila.unions)
  @JoinColumn({ name: 'upazila_id' })
  upazila!: UpazilaEntity;

  @Column()
  name!: string;

  @Column({ name: 'bn_name' })
  bnName!: string;

  @Column({ nullable: true })
  url!: string;

  @OneToMany((_type) => ShippingAddressEntity, (shippingAddress) => shippingAddress.union)
  shippingAddress!: ShippingAddressEntity[];
}
