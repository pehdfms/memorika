import { AuditedEntity } from '@libs/types/entity'
import { Entity, Property } from '@mikro-orm/core'
import { Exclude } from 'class-transformer'

@Entity()
export class User extends AuditedEntity {
  @Property()
  nickname: string

  @Property({ unique: true })
  email: string

  @Property()
  @Exclude()
  password: string
}
