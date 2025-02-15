export interface ProductCategory {
  categoryId: number;
}


export interface ProductVariant {
  id: number;
  price: number;
  purchasePrice: number;
  productId: number;
  sizeId: number;
  stockQty: number;
}

export interface ProductType {
  id: number;
  name: string;
  type: string;
  taxId: number;
  unitId: number;
  images: string[]; // Assuming this is an array of image URLs
  singleImage: string;
  brandId: number;
  discountId: number;
  alertQty: number;
  limitPurchaseQty: number;
  tags: string[];
  description: string;
  shortDescription: string;
  enableReview: boolean;
  status: string;
  productVariants: ProductVariant[];
  productCategories: ProductCategory[];
}