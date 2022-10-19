import { IsDefined, IsEnum, IsString } from 'class-validator'
import { AvailableSchedulers } from '../domain/value-objects/schedulers/available-schedulers.enum'

export class CreateDeckDto {
  @IsDefined()
  @IsString()
  name: string

  @IsDefined()
  @IsString()
  description: string

  @IsDefined()
  @IsEnum(AvailableSchedulers)
  scheduler: AvailableSchedulers
}
