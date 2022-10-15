import { AuditedEntity } from 'src/libs/types/common/entity'
import { Column, Entity } from 'typeorm'

@Entity()
export class Deck extends AuditedEntity {
  @Column({ nullable: false })
  name: string

  @Column({ nullable: false })
  description: string
}
