import { Transform, TransformFnParams } from 'class-transformer'
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  NotContains
} from 'class-validator'

export class CreateUserDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MinLength(3)
  @MaxLength(25)
  nickname: string

  @IsEmail()
  @IsDefined()
  @IsString()
  email: string

  @IsDefined()
  @IsString()
  @NotContains(' ')
  @MinLength(5)
  password: string
}
