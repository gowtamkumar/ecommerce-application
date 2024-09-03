import "reflect-metadata";
import { RoleEnum } from "../enums/role.enum";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ProductEntity } from "../../product/model/product.entity";
import { GenderEnum, TypeEnum } from "../enums";
import { StatusEnum } from "../enums/status.enum";
import { OrderEntity } from "../../order/model/order.entity";
import { ShippingAddressEntity } from "../../shipping-address/model/shipping-address.entity";
import { ReviewEntity } from "../../review/model/review.entity";
import { WishListEntity } from "../../wishlist/model/wishlist.entity";
import { PaymentEntity } from "../../payment/model/payment.entity";
import { UserActivityEntity } from "./user-activity.entity";
import { PostEntity } from "../../post/model/post.entity";

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  username!: string;

  @Column()
  password?: string;

  @Column({ unique: true })
  email!: string;

  @Column({ type: "enum", enum: TypeEnum, default: TypeEnum.Customer })
  type!: TypeEnum;

  @Column({ unique: true, nullable: true })
  phone?: string;

  @Column({ nullable: true })
  dob?: string;

  @Column({ type: "enum", enum: GenderEnum, nullable: true })
  gender!: GenderEnum;

  @Column({ nullable: true })
  point?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ type: "enum", enum: RoleEnum, default: RoleEnum.User })
  role!: RoleEnum;

  // @Column({ name: "is_admin", type: "boolean", default: false })
  // isAdmin!: boolean;

  @Column({ type: "enum", enum: StatusEnum, default: StatusEnum.Active })
  status!: StatusEnum;

  @Column({ name: "last_login", type: "timestamp", nullable: true })
  lastLogin?: string;

  @Column({ name: "last_logout", type: "timestamp", nullable: true })
  lastLogout?: string;

  @Column({ name: "ip_address", nullable: true })
  ipAddress?: string;

  @Column({ name: "divice_id", nullable: true })
  diviceId?: string;

  @Column({ name: "reset_token", nullable: true })
  resetToken?: string;

  // @Column({ name: "reset_token_expire", type: "bigint", nullable: true })
  // resetTokenExpire?: number;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt?: string;

  // Relation
  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt?: string;

  @OneToMany((_type) => ProductEntity, (product) => product.user)
  products!: ProductEntity[];

  @OneToMany((_type) => OrderEntity, (product) => product.user)
  orders!: OrderEntity[];

  @OneToMany((_type) => OrderEntity, (order) => order.deliveryMan)
  orderDeliveries!: OrderEntity[];

  @OneToMany((_type) => ShippingAddressEntity, (shipping) => shipping.user)
  shippingAddress!: ShippingAddressEntity[];

  @OneToMany((_type) => ReviewEntity, (review) => review.user)
  reviews!: ReviewEntity[];

  @OneToMany((_type) => WishListEntity, (wishlist) => wishlist.user)
  wishlists!: WishListEntity[];

  @OneToMany((_type) => PaymentEntity, (payment) => payment.user)
  payments!: PaymentEntity[];

  @OneToMany((_type) => UserActivityEntity, (userActivity) => userActivity.user)
  userActivities!: UserActivityEntity[];

  @OneToMany((_type) => PostEntity, (post) => post.user)
  posts!: PostEntity[];

}
