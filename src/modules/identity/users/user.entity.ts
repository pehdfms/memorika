import { AuditedEntity } from '@libs/types/entity'
import { Entity, Property } from '@mikro-orm/core'

@Entity()
export class User extends AuditedEntity {
  @Property()
  nickname: string

  @Property({ unique: true })
  email: string

  @Property({ hidden: true })
  password: string
}
