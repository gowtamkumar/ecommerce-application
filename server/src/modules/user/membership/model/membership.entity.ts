import 'reflect-metadata';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('memberships')
export class MembershipEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string; // Silver, Gold, Prime

  @Column({ nullable: true })
  fee!: number;

  @Column({ name: 'duration_days' })
  durationDays!: number;

  @Column({ name: 'discount_percentage', type: 'float' })
  discountPercentage!: number;

  @Column({ name: 'bonus_points_multiplier', type: 'float', default: 1 })
  bonusPointsMultiplier!: number;

  @Column({ name: 'free_shipping', default: false })
  freeShipping!: boolean;

  @Column({ default: true })
  active!: boolean;
}
