export interface DiscountTaxCalculationFun {
  discount: string;
  discount_type: string;
  unit_price: string;
  tax: string;
}


export interface CartCalculationFun {
  discount: string;
  discount_type: string;
  unit_price: string;
  tax: string;
}

export interface CartProduct{
  
    thumbnail_img_url: string;
    name: string;
    unit_price: string;
    qty: number;
    tax_amount: number;
    discount_amount: number;
  
}
