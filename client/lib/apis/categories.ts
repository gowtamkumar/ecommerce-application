"use server";
import http from "../api/http";
import type { ApiResponse } from "../utils/commonFunctions";

export interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string | null;
  level?: number;
  description?: string | null;
  active: boolean;
  isFeatured: boolean;
  parentId?: number | null;
  userId: number;
  createdAt?: string;
  updatedAt?: string;
  children?: Category[] | null;
}

/** Row shape returned by the /categories/antd endpoint (list table + parent TreeSelect). */
export interface CategoryTreeRow extends Category {
  key: string;
  value: number;
  label: string;
  title: string;
}

export interface PaginatedCategories {
  success: boolean;
  message?: string;
  totalItem: number;
  page: number;
  perPage: number;
  data: Category[];
}

export interface CreateCategoryInput {
  name: string;
  parentId?: number | null;
  image?: string | null;
  description?: string | null;
  active?: boolean;
  isFeatured?: boolean;
}

export interface UpdateCategoryInput extends CreateCategoryInput {
  id: number;
}

export async function getPublicCategories(): Promise<PaginatedCategories> {
  return http.get<PaginatedCategories>("/categories/all", { auth: false, next: { revalidate: 30 } });
}

export async function getAntdCategories(): Promise<ApiResponse<CategoryTreeRow[]>> {
  return http.get<ApiResponse<CategoryTreeRow[]>>("/categories/antd");
}

export async function getCategoriesForMenu(): Promise<ApiResponse<Category[]>> {
  return http.get<ApiResponse<Category[]>>("/categories/menu");
}

export async function getCategories(): Promise<PaginatedCategories> {
  return http.get<PaginatedCategories>("/categories");
}

export async function saveCategory(data: CreateCategoryInput): Promise<ApiResponse<Category>> {
  return http.post<ApiResponse<Category>>("/categories", data);
}

export async function updateCategory(data: UpdateCategoryInput): Promise<ApiResponse<Category>> {
  return http.put<ApiResponse<Category>>(`/categories/${data.id}`, data);
}

export async function deleteCategory(id: number): Promise<ApiResponse<Category>> {
  return http.remove<ApiResponse<Category>>(`/categories/${id}`);
}