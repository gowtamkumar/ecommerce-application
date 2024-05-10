import "reflect-metadata";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TaxTypeEnum } from "../enums/tax-type.enum";
import { ProductEntity } from "../../product/model/product.entity";

@Entity("taxs")
export class TaxEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "enum", enum: TaxTypeEnum })
  type!: TaxTypeEnum;

  @Column({ type: "numeric", precision: 4, scale: 2 })
  value!: number;

  @Column({ name: "user_id", nullable: true })
  userId!: string;

  @Column({ type: "boolean", default: true })
  status!: boolean;

  @OneToMany((_type) => ProductEntity, (product) => product.tax)
  products!: ProductEntity[];
}
