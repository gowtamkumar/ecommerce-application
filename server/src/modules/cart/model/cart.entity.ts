import "reflect-metadata";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ProductEntity } from "../../product/model/product.entity";
import { UserEntity } from "../../auth/model/user.entity";
import { ProductVariantEntity } from "../../product-variant/model/product-variant.entity";

@Entity("carts")
export class CartEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "product_id" })
  productId!: number;
  @ManyToOne((_type) => ProductEntity, (product) => product.reviews)
  @JoinColumn({ name: "product_id" })
  product!: ProductEntity;

  @Column({ name: "product_variant_id" })
  productVariantId!: number;
  @ManyToOne((_type) => ProductVariantEntity, (productv) => productv.carts)
  @JoinColumn({ name: "product_variant_id" })
  productVariant!: ProductVariantEntity;

  @Column()
  qty!: number;

  @Column({ name: "user_id" })
  userId!: number;
  @ManyToOne((_type) => UserEntity, (user) => user.reviews)
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt?: string;

  // @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  // updatedAt?: string;
}


// select 
// * 
// from carts 
// LEFT JOIN products ON products.id = carts.product_id
// LEFT JOIN product_variants ON product_variants.id = carts.product_variant_id
// LEFT JOIN sizes ON sizes.id = product_variants.size_id
// LEFT JOIN colors ON colors.id = product_variants.color_id