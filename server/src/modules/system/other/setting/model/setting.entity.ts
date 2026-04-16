import 'reflect-metadata';
import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('settings')
export class SettingEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'site_name' })
  siteName!: string;

  @Column({ nullable: true })
  image!: string;

  @Column({
    name: 'order_free_shipping_amount',
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  orderFreeShippingAmount!: number;

  @Column({ nullable: true })
  favicon!: string;

  @Column({ nullable: true })
  address!: string;

  @Column({ nullable: true })
  phone!: string;

  @Column({ nullable: true })
  email!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ name: 'social_link', type: 'simple-json', nullable: true })
  socialLink!: string;

  @Column({ type: 'simple-json', nullable: true })
  seo!: any;

  @Column({ type: 'simple-json', nullable: true })
  marketing!: any;

  @Column({ name: 'email_config', type: 'simple-json', nullable: true })
  emailConfig!: string;

  @Column({ name: 'whats_app_widget', type: 'simple-json', nullable: true })
  whatsAppWidget!: string;

  @Column({ name: 'payment_account', type: 'simple-json', nullable: true })
  paymentAccount!: string;

  @Column({ name: 'home_page', type: 'simple-json', nullable: true })
  homePage!: string;

  @Column({ name: 'about_page', type: 'simple-json', nullable: true })
  aboutPage!: string;

  @Column({ name: 'contact_page', type: 'simple-json', nullable: true })
  contactPage!: string;

  @Column({ name: 'term_policy_page', type: 'simple-json', nullable: true })
  termPolicyPage!: string;

  @Column({ name: 'footer_option', type: 'simple-json', nullable: true })
  footerOption!: string;

  @Column({ name: 'header_option', type: 'simple-json', nullable: true })
  headerOption!: string;

  @Column({ name: 'appearance', type: 'simple-json', nullable: true })
  appearance!: any;

  @Column({ name: 'faq', type: 'simple-json', nullable: true })
  faq!: string;

  @Column({ name: 'help_support', type: 'simple-json', nullable: true })
  helpSupport!: string;

  @Column({ name: 'return_setting', type: 'simple-json', nullable: true })
  returnSetting!: any;

  // @CreateDateColumn({ name: "created_at",type: "timestamp" })
  // createdAt?: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt?: string;
}
