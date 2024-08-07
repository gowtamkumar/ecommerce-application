import "reflect-metadata";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("settings")
export class SettingEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  logo!: string;

  @Column({ name: "company_name" })
  companyName!: string;

  @Column({ nullable: true })
  address!: string;

  @Column({ type: "simple-json", nullable: true })
  social!: string[];

  @Column({ type: "simple-json", nullable: true })
  footer!: string[];

  @Column({ type: "simple-json", nullable: true })
  theme!: string[];

  @Column({ type: "simple-json", nullable: true })
  account!: string[];

  @Column({ type: "simple-json", nullable: true })
  icons!: string[];

  // @CreateDateColumn({ name: "created_at",type: "timestamp" })
  // createdAt?: string;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt?: string;
}
