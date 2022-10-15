import { BadRequestException } from '@nestjs/common'
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString
} from 'class-validator'
import { AuditedEntity } from 'src/libs/types/entity'
import { AfterLoad, Column, Entity, ManyToOne } from 'typeorm'
import { FlashCardSchedulingStrategy } from '../value-objects/schedulers/flash-card-scheduling.strategy'
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

  isDue: boolean

  repetitions: Repetition[]

  @ManyToOne(() => Deck, (deck) => deck.flashCards, { onDelete: 'CASCADE' })
  deck: Deck

  get passes(): Repetition[] {
    return this.repetitions.filter((repetition) => repetition.answeredCorrectly)
  }

  get lapses(): Repetition[] {
    return this.repetitions.filter((repetition) => !repetition.answeredCorrectly)
  }

  @AfterLoad()
  setIsDue() {
    this.isDue = this.dueDate === null ? true : this.dueDate <= new Date()
  }

  private isAnswerCorrect(answer: string): boolean {
    return this.possibleAnswers.includes(answer)
  }

  public submitAnswer(answer: string, scheduler: FlashCardSchedulingStrategy) {
    if (!this.isDue) {
      throw new BadRequestException(
        'Submitting answers for flash cards that are not due is not allowed!'
      )
    }

    //this.repetitions.push({ answeredCorrectly: this.isAnswerCorrect(answer) })
  }
}
