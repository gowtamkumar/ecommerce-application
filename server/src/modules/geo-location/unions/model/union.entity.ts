import "reflect-metadata";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UpazilaEntity } from "../../upazilas/model/upazila.entity";

@Entity("unions")
export class UnionEntity {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({ name: "upazilla_id", nullable: true })
  upazillaId!: number;
  @ManyToOne((_type) => UpazilaEntity, (Upazila) => Upazila.unions)
  @JoinColumn({ name: "upazilla_id" })
  upazilla!: UpazilaEntity;

  @Column()
  name!: string;

  @Column({ name: "bn_name" })
  bnName!: string;

  @Column({ nullable: true })
  url!: string;
 
}
