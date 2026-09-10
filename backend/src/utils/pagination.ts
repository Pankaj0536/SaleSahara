import { Request } from 'express';

export interface PaginationOptions {
  page: number;
  limit: number;
  skip: number;
}

export const getPagination = (req: Request, defaultLimit = 25): PaginationOptions => {
  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || defaultLimit));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const buildPaginationMetadata = (total: number, page: number, limit: number) => {
  return {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit) || 1
  };
};
