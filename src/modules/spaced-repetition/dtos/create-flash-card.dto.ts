import { ArrayNotEmpty, IsArray, IsDefined, IsString } from 'class-validator'

export class CreateFlashCardDto {
  @IsDefined()
  @IsString()
  question: string

  @IsDefined()
  @IsArray()
  @ArrayNotEmpty()
  possibleAnswers: string[]
}
