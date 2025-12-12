export interface ProductCategory {
  category: { name: string };
}

export interface ProductVariant {
  id: number;
  unitPrice: number;
  purchasePrice: number;
  productId: number;

  sizeId: number;
  stockQty: number;
}

export interface ProductType {
  id: number;
  name: string;
  slug: string;
  type: string;
  tax: { name: string };
  unit: { name: string };
  images: string[]; // Assuming this is an array of image URLs
  thumbnailImage: string;
  brand: { name: string };
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
