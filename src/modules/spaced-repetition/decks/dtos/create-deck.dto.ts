import { AvailableSchedulers } from '@modules/spaced-repetition/schedulers/scheduler.factory'
import { Transform, TransformFnParams } from 'class-transformer'
import { IsDefined, IsEnum, IsNotEmpty, IsString } from 'class-validator'

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
