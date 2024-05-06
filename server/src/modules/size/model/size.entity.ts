import "reflect-metadata";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductVariantEntity } from "../../product-variant/model/product-variant.entity";

@Entity("sizes")
export class SizeEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: "boolean", default: true })
  status!: boolean;

  @OneToMany(
    (_type) => ProductVariantEntity,
    (productVarients) => productVarients.size
  )
  productVariants!: ProductVariantEntity[];
}
