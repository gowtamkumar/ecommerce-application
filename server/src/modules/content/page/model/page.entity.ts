import 'reflect-metadata';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ContentType, PageStatus } from '../enums';

@Entity('pages')
export class PageEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  slug!: string;

  @Column({ type: 'boolean', default: false })
  isHomePage!: boolean;

  @Column({ type: 'int', default: 0 })
  order!: number;

  @Column({ type: 'jsonb', nullable: true })
  sections!: Array<{
    id: string;
    type:
      | 'banner'
      | 'product-slider'
      | 'category-grid'
      | 'offer-banner'
      | 'review-slider'
      | 'text-block'
      | 'image-block'
      | 'button'
      | 'faq-section'
      | string;
    settings?: any;
    styles?: any;
    disabled?: boolean;
  }>;

  @Column({ type: 'varchar', length: 255, nullable: true })
  metaTitle!: string;

  @Column({ type: 'text', nullable: true })
  metaDescription!: string;

  @Column({ type: 'jsonb', nullable: true })
  typography!: {
    fontFamily?: string;
    headingFont?: string;
    baseFontSize?: number;
    headingFontFamily?: string;
    headingFontWeight?: string;
    headingFontSize?: string;
    headingLineHeight?: string;
    paragraphFontFamily?: string;
    paragraphFontWeight?: string;
    paragraphFontSize?: string;
    paragraphLineHeight?: string;
  };

  @Column({
    type: 'enum',
    enum: ['draft', 'published'],
    default: 'published',
  })
  status!: string;

  @Column({ name: 'user_id' })
  userId!: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
