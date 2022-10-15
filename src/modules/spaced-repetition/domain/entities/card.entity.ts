import { ArrayNotEmpty, IsArray, IsDateString, IsNotEmpty, IsString } from 'class-validator'
import { AuditedEntity } from 'src/libs/types/common/entity'
import { Column } from 'typeorm'
import { Repetition } from './repetition.entity'

export class Card extends AuditedEntity {
  @IsString()
  @IsNotEmpty()
  private _question: string

  @IsArray()
  @ArrayNotEmpty()
  private _possibleAnswers: string[]

  @IsDateString()
  @Column({ type: 'timestamp with time zone' })
  dueDate?: Date

  repetitions: Repetition[]

  get passes(): Repetition[] {
    return this.repetitions.filter((repetition) => this.checkAnswer(repetition.answer))
  }

  get lapses(): Repetition[] {
    return this.repetitions.filter((repetition) => !this.checkAnswer(repetition.answer))
  }

  get isDue(): boolean {
    return this.dueDate <= new Date()
  }

  set possibleAnswers(possibleAnswers: string[]) {
    this._possibleAnswers = possibleAnswers.map((possibleAnswer) => possibleAnswer.toLowerCase())
  }

  private checkAnswer(answer: string): boolean {
    return this.possibleAnswers.includes(answer)
  }

  public giveAnswer(answer: string) {}
}
