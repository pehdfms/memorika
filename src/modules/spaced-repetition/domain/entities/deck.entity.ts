import { AuditedEntity } from 'src/libs/types/common/entity'
import { Column, Entity, OneToMany } from 'typeorm'
import { FlashCard } from './flash-card.entity'

@Entity()
export class Deck extends AuditedEntity {
  @Column()
  name: string

  @Column()
  description: string

  @OneToMany(() => FlashCard, (flashcard) => flashcard.deck)
  flashCards: FlashCard[]
}
