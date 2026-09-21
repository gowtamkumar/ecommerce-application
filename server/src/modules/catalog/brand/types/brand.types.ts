import { BrandEntity } from '../model/brand.entity';

export type Brand = BrandEntity;

export interface PaginatedResult<T = Brand> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
}

export interface CreateBrandInput {
  name: string;
  image?: string | null;
  status?: string;
  userId: number;
}

export interface UpdateBrandInput {
  name: string;
  image?: string | null;
  status?: string;
}
