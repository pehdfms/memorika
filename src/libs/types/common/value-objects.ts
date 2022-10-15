import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm'

export class Metadata {
  @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  created: Date

  @UpdateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  updated: Date

  @DeleteDateColumn({ type: 'timestamp with time zone' })
  removed: Date
}
