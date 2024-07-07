import "reflect-metadata";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("colors")
export class ColorEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  color!: string;

  @Column({ name: "user_id" })
  userId!: number;
}
