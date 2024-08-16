import "reflect-metadata";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("banners")
export class BannerEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  type!: string;

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
