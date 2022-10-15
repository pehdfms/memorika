import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString
} from 'class-validator'
import { AuditedEntity } from 'src/libs/types/common/entity'
import { AfterLoad, Column, Entity, ManyToOne } from 'typeorm'
import { Deck } from './deck.entity'
import { Repetition } from './repetition.entity'

@Entity()
export class FlashCard extends AuditedEntity {
  @IsString()
  @IsNotEmpty()
  readonly question: string

  @IsArray()
  @ArrayNotEmpty()
  readonly possibleAnswers: string[]

  @IsDateString()
  @IsOptional()
  @Column({
    type: 'timestamp with time zone',
    default: new Date()
  })
  dueDate: Date

  protected isDue: boolean

  repetitions: Repetition[]

  @ManyToOne(() => Deck, (deck) => deck.flashCards, { onDelete: 'CASCADE' })
  deck: Deck

  get passes(): Repetition[] {
    return this.repetitions.filter((repetition) => this.checkAnswer(repetition.answer))
  }

  get lapses(): Repetition[] {
    return this.repetitions.filter((repetition) => !this.checkAnswer(repetition.answer))
  }

  @AfterLoad()
  setIsDue() {
    this.isDue = this.dueDate === null ? true : this.dueDate <= new Date()
  }

  private checkAnswer(answer: string): boolean {
    return this.possibleAnswers.includes(answer)
  }

  public submitAnswer(answer: string) {}
}
