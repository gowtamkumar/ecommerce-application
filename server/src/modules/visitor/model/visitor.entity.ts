import "reflect-metadata";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity("visitors")
export class VisitorEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  count!: number;

}
