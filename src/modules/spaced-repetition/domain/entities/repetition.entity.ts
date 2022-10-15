import { AuditedEntity } from 'src/libs/types/entity'

export class Repetition extends AuditedEntity {
  answer: string
  answeredCorrectly: boolean
}
