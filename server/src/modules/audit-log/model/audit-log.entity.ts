import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  FAILED_LOGIN = 'FAILED_LOGIN',
}

@Entity('audit_logs')
@Index(['userId', 'createdAt'])
@Index(['resourceType', 'resourceId'])
@Index(['createdAt'])
export class AuditLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // Who performed the action
  @Column({ nullable: true })
  userId!: string;

  @Column({ nullable: true })
  userName!: string;

  @Column({ nullable: true })
  userEmail!: string;

  @Column({ nullable: true })
  userRole!: string;

  // What action was performed
  @Column({
    type: 'enum',
    enum: AuditAction,
  })
  action!: AuditAction;

  @Column()
  resourceType!: string; // 'Product', 'Order', 'User', 'Category', etc.

  @Column({ nullable: true })
  resourceId!: string;

  @Column({ nullable: true })
  resourceName!: string; // Human-readable name (e.g., product name, order number)

  // Details of the change
  @Column('jsonb', { nullable: true })
  oldValues!: Record<string, any>;

  @Column('jsonb', { nullable: true })
  newValues!: Record<string, any>;

  // Additional metadata
  @Column('jsonb', { nullable: true })
  metadata!: {
    ip?: string;
    userAgent?: string;
    [key: string]: any;
  };

  // When
  @CreateDateColumn()
  createdAt!: Date;
}
