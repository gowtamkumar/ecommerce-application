import 'reflect-metadata';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('contacts')
export class ContactEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  email!: string;

  @Column()
  phone!: string;

  @Column()
  subject!: string;

  @Column()
  message!: string;
}
