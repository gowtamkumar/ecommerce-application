export interface ProductCategory {
  category: { id?: number; name: string };
}

export interface ProductVariant {
  id: number;
  unitPrice: number;
  purchasePrice: number;
  productId: number;
  sizeId?: number;
  colorId?: number;
  size?: { id?: number; name: string };
  color?: { id?: number; name: string; color?: string };
  stockQty: number;
}

export interface ProductType {
  id: number;
  name: string;
  slug: string;
  type: string;
  taxId?: number;
  tax?: { id?: number; name: string; value?: number };
  unit?: { id?: number; name: string };
  images: string[];
  thumbnailImage: string;
  brand?: { id?: number; name: string };
  discountId?: number;
  discount?: {
    id?: number;
    name?: string;
    discountStrategy?: "Percentage" | "Fixed" | string;
    value?: number;
  };
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

