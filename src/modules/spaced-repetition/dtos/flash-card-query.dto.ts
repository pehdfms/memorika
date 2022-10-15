import { IsDefined, IsUUID } from 'class-validator'

export class FlashCardQueryDto {
  @IsDefined()
  @IsUUID()
  deck: string

  @IsDefined()
  @IsUUID()
  id: string
}
