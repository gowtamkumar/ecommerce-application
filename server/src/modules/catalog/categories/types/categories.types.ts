import { CategoriesEntity } from '../model/categories.entity';

export type Category = CategoriesEntity;

export interface PaginatedResult<T = Category> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
}

export interface CreateCategoryInput {
  name: string;
  image?: string | null;
  description?: string | null;
  parentId?: number | null;
  isFeatured?: boolean;
  active?: boolean;
  userId: number;
}

export interface UpdateCategoryInput {
  name: string;
  image?: string | null;
  description?: string | null;
  parentId?: number | null;
  isFeatured?: boolean;
  active?: boolean | null;
}

export const MAX_DEPTH = 3;
