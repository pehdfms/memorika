import { ApiPropertyOptional } from '@nestjs/swagger'
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDefined,
  IsOptional,
  IsString,
  IsUUID
} from 'class-validator'

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

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  caseSensitive: boolean = false
}
