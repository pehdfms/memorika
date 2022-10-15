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

export class PaginationResponse<T> {
  constructor(query: PaginationQuery, total: number, data: T[]) {
    const { page, perPage } = query

    this.data = data
    this.page = {
      perPage: +perPage,
      totalItems: total,
      totalPages: Math.ceil(total / perPage),
      current: +page
    }
  }

  data: T[]
  page: {
    perPage: number
    totalItems: number
    totalPages: number
    current: number
  }
}
