export interface PaginationQuery {
  page: number;
  perPage: number;
  skip: number;
  take: number;
}

export interface PaginationParams {
  page?: unknown;
  perPage?: unknown;
  limit?: unknown;
}

export const DEFAULT_PER_PAGE = 10;

/**
 * Normalize pagination query params into safe integers plus skip/take.
 * Guards against negative / non-numeric input.
 */
export const parsePagination = (
  query: PaginationParams = {},
  defaultPerPage = DEFAULT_PER_PAGE,
): PaginationQuery => {
  const page = Math.max(1, Number(query.page) || 1);
  const perPage = Math.max(1, Number(query.perPage || query.limit) || defaultPerPage);

  return { page, perPage, skip: (page - 1) * perPage, take: perPage };
};
