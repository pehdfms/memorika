import { IsDefined, IsString } from 'class-validator'

export class CreateDeckDto {
  @IsDefined()
  @IsString()
  name: string

  @IsDefined()
  @IsString()
  description: string
}
