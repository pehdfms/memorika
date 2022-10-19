import { randomUUID } from 'crypto'
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

export class AbstractEntity {
  constructor() {
    this.id = randomUUID()
  }

  @PrimaryGeneratedColumn('uuid')
  id: string
}

export class AuditedEntity extends AbstractEntity {
  constructor() {
    super()

    this.created = new Date()
    this.updated = new Date()
  }

  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
    update: false
  })
  created: Date

  @UpdateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  updated: Date
}

export class SoftDeleteEntity extends AbstractEntity {
  @DeleteDateColumn({ type: 'timestamp with time zone' })
  removed?: Date
}
