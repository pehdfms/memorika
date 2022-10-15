import { PaginationQuery } from '../types/pagination'

export function getPaginationOptions(query: PaginationQuery) {
  const { page, perPage } = query

  return {
    take: +perPage,
    skip: page * perPage
  }
}
