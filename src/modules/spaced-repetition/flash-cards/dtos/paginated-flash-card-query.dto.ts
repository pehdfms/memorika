import { PaginationQuery } from '@libs/types/pagination'
import { IsOptional, IsUUID } from 'class-validator'

export class PaginatedFlashCardQuery extends PaginationQuery {
  @IsOptional()
  @IsUUID()
  deck?: string
}
