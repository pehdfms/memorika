import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNumber, IsOptional, Min } from 'class-validator'

export class PaginationQuery {
  @ApiPropertyOptional({ default: 0 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  page: number = 0

  @ApiPropertyOptional({ default: 20 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  perPage: number = 20
}

export interface PaginationResponse<T> {
  data: T[]
  page: {
    perPage: number
    totalItems: number
    totalPages: number
    current: number
  }
}
