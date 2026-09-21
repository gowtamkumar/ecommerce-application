"use server";
import http from "../api/http";
import type { ApiResponse } from "../utils/commonFunctions";

export interface Brand {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  description: string | null;
  status: "Active" | "Inactive";
  userId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedBrands {
  success: boolean;
  message?: string;
  totalItem: number;
  page: number;
  perPage: number;
  data: Brand[];
}

export interface SaveBrandInput {
  id?: number;
  name: string;
  image?: string | null;
  status?: string;
}

export async function getBrands(): Promise<ApiResponse<Brand[]>> {
  return http.get<ApiResponse<Brand[]>>("/brands");
}

export async function saveBrand(data: SaveBrandInput): Promise<ApiResponse<Brand>> {
  return http.post<ApiResponse<Brand>>("/brands", data);
}

export async function updateBrand(data: SaveBrandInput): Promise<ApiResponse<Brand>> {
  return http.patch<ApiResponse<Brand>>(`/brands/${data.id}`, data);
}

export async function deleteBrand(id: number): Promise<ApiResponse<Brand>> {
  return http.remove<ApiResponse<Brand>>(`/brands/${id}`);
}