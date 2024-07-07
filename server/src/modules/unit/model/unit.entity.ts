import "reflect-metadata";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductEntity } from "../../product/model/product.entity";

@Entity("units")
export class UnitEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ name: "user_id" })
  userId!: number;


  @OneToMany((_type) => ProductEntity, (product) => product.unit)
  products!: ProductEntity[];
}
