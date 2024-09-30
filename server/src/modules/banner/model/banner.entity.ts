import "reflect-metadata";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BannerType } from "../enums/banner-type.enum";

@Entity("banners")
export class BannerEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ type: "enum", enum: BannerType, default: BannerType.Slider })
  type!: BannerType;

  @Column()
  image!: string;

  @Column({ nullable: true })
  url!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ type: "boolean", default: true })
  status!: boolean;

  @Column({ name: "user_id" })
  userId!: number;
}
