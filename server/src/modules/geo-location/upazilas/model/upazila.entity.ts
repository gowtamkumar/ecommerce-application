import "reflect-metadata";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DistrictEntity } from "../../districts/model/district.entity";
import { UnionEntity } from "../../unions/model/union.entity";

@Entity("upazilas")
export class UpazilaEntity {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({ name: "district_id", nullable: true })
  districtId!: number;
  @ManyToOne((_type) => DistrictEntity, (district) => district.upazilas)
  @JoinColumn({ name: "district_id" })
  district!: DistrictEntity;

  @Column()
  name!: string;

  @Column({ name: "bn_name" })
  bnName!: string;

  @Column({ nullable: true })
  url!: string;

  @OneToMany((_type) => UnionEntity, (union) => union.upazilla)
  unions!: UnionEntity[];
}
