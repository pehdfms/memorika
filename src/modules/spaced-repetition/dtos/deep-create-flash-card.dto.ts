import { IsDefined, IsUUID } from 'class-validator'
import { CreateFlashCardDto } from './create-flash-card.dto'

export class DeepCreateFlashCardDto extends CreateFlashCardDto {
  @IsDefined()
  @IsUUID()
  deck: string
}
