import { ArrayNotEmpty, IsArray, IsDefined, IsString, IsUUID } from 'class-validator'

export class CreateFlashCardDto {
  @IsDefined()
  @IsString()
  @IsUUID()
  deck: string

  @IsDefined()
  @IsString()
  question: string

  @IsDefined()
  @IsArray()
  @ArrayNotEmpty()
  possibleAnswers: string[]
}
