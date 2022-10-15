import { PaginationQuery } from '../types/common/pagination'

export function getPaginationOptions(query: PaginationQuery) {
  const { page, perPage } = query

  return {
    take: +perPage,
    skip: page * perPage
  }
}

export function getPaginationResult(query: PaginationQuery, total: number) {
  const { page, perPage } = query

  return {
    page: {
      perPage: +perPage,
      totalItems: total,
      totalPages: Math.ceil(total / perPage),
      current: +page
    }
  }
}
