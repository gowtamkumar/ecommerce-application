import 'reflect-metadata';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductEntity } from '../../products/product/model/product.entity';
import { Status } from '../../../enums/status.enum';
import { ApplicableBrandEntity } from '../../discount/model/applicable-brand.entity';

@Entity('brands')
export class BrandEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column({ nullable: true }) // need to remove this
  slug!: string;

  @Column({ nullable: true })
  image!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.Active,
  })
  status!: Status;

  @Column({ name: 'user_id' })
  userId!: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt?: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt?: string;

  @OneToMany((_type) => ProductEntity, (product) => product.brand)
  products!: ProductEntity[];

  @OneToMany((_type) => ApplicableBrandEntity, (product) => product.brand)
  applicableBrands!: ApplicableBrandEntity[];
}
