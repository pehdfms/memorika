import { ApiProperty } from '@nestjs/swagger'
import { ArrayNotEmpty, IsArray, IsBoolean, IsDefined, IsString, IsUUID } from 'class-validator'

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

  @ApiProperty({ default: false })
  @IsDefined()
  @IsBoolean()
  caseSensitive: boolean
}
