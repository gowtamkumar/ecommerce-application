import "reflect-metadata";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DistrictEntity } from "../../districts/model/district.entity";

@Entity("divisions")
export class DivisionEntity {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  name!: string;

  @Column({ name: "bn_name" })
  bnName!: string;

  @Column()
  url!: string;

  @OneToMany((_type) => DistrictEntity, (district) => district.division)
  districts!: DistrictEntity[];
}
