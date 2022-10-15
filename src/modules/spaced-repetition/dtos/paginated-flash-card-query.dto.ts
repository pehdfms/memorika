import { IsDefined, IsUUID } from 'class-validator'
import { PaginationQuery } from 'src/libs/types/pagination'

export class PaginatedFlashCardQuery extends PaginationQuery {
  @IsDefined()
  @IsUUID()
  deck: string
}
