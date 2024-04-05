export interface UpdateProductDto {
  name: string;
  price: number;
  color: string;
  urlSlug: string;
  brandId: string;
  categoryId: string;
  stockQty: number;
  userId: string;
  description: string;
  status?: boolean;
}
