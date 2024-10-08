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

  @Column({ name: "company_name" })
  companyName!: string;

  @Column({ nullable: true })
  image!: string;

  @Column({ nullable: true })
  address!: string;

  @Column({ nullable: true })
  phone!: string;

  @Column({ nullable: true })
  email!: string;

  @Column({ nullable: true })
  currencyId!: number;

  @Column({ name: "social_link", type: "simple-json", nullable: true })
  socialLink!: string;

  @Column({ name: "email_config", type: "simple-json", nullable: true })
  emailConfig!: string;

  @Column({ name: "payment_account", type: "simple-json", nullable: true })
  paymentAccount!: string;

  @Column({ name: "home_page", type: "simple-json", nullable: true })
  homePage!: string;

  @Column({ name: "about_page", type: "simple-json", nullable: true })
  aboutPage!: string;

  @Column({ name: "contact_page", type: "simple-json", nullable: true })
  contactPage!: string;

  @Column({ name: "term_policy_page", type: "simple-json", nullable: true })
  termPolicyPage!: string;

  @Column({ name: "footer_option", type: "simple-json", nullable: true })
  footerOption!: string;

  @Column({ name: "header_option", type: "simple-json", nullable: true })
  headerOption!: string;

  @Column({ name: "help_support", type: "simple-json", nullable: true })
  helpSupport!: string;

  // @CreateDateColumn({ name: "created_at",type: "timestamp" })
  // createdAt?: string;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt?: string;
}
