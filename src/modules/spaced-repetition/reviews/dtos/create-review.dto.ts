import { IsDefined, IsString, IsUUID } from 'class-validator'

export class CreateReviewDto {
  @IsDefined()
  @IsString()
  @IsUUID()
  flashCard: string

  @IsDefined()
  @IsString()
  answer: string
}
