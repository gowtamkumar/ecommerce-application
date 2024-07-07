import "reflect-metadata";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TaxTypeEnum } from "../enums/tax-type.enum";
import { ProductEntity } from "../../product/model/product.entity";
import { Status } from "../../../enums/status.enum";

@Entity("taxs")
export class TaxEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: "enum", enum: TaxTypeEnum })
  type!: TaxTypeEnum;

  @Column()
  value!: number;

  @Column({ name: "user_id" })
  userId!: number;

  @Column({ type: "enum", enum: Status, default: Status.Active })
  status!: Status;

  @OneToMany((_type) => ProductEntity, (product) => product.tax)
  products!: ProductEntity[];
}
