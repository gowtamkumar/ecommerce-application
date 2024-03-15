import {
  AfterInsert,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterUpdate,
  AfterRemove,
} from 'typeorm'

@Entity('files')
export class FileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  fieldname: string

  @Column({ nullable: true })
  originalname: string

  @Column({ nullable: true })
  encoding: string

  @Column({ nullable: true })
  mimetype: string

  @Column({ nullable: true })
  destination: string

  @Column({ nullable: true })
  filename: string

  @Column({ nullable: true })
  path: string

  @Column({ nullable: true })
  size: number

  @Column({ name: 'is_active', default: false })
  isActive: boolean

  // Relations

  // hooks
  @AfterInsert()
  logInsert() {
    console.log(`Inserted File with id: ${this.id}`)
  }

  @AfterUpdate()
  logUpdate() {
    console.log(`Updated File with id: ${this.id}`)
  }

  @AfterRemove()
  logRemove() {
    console.log(`Removed File`)
  }
}
