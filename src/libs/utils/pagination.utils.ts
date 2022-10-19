import { PaginationQuery } from '../types/pagination'

export function getPaginationOptions(query: PaginationQuery) {
  const { page, perPage } = query

  return {
    limit: +perPage,
    offset: page * perPage
  }
}
