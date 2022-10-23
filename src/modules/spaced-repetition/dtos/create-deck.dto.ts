import { Transform, TransformFnParams } from 'class-transformer'
import { IsDefined, IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { AvailableSchedulers } from '../domain/value-objects/schedulers/available-schedulers.enum'

export class CreateDeckDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  name: string

  @IsDefined()
  @IsString()
  description: string

  @IsDefined()
  @IsEnum(AvailableSchedulers)
  scheduler: AvailableSchedulers
}
