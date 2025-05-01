import "reflect-metadata";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("user_memberships")
export class UserMembershipEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  // @ManyToOne(() => User)
  // user: User;

  // @ManyToOne(() => Membership)
  // membership: Membership;

  @Column({ name: "start_date", type: "timestamp" })
  startDate!: Date;

  @Column({ name: "end_date", type: "timestamp" })
  endDate!: Date;
}
