export interface DiscountTaxCalculationFun {
  discount: {value: number, discountType: string};
  unitPrice: string;
  tax: string;
}


export interface CartCalculationFun {
  discount: string;
  discount_type: string;
  price: string;
  tax: string;
}

export interface CartProduct{
  
    thumbnail_img_url: string;
    name: string;
    price: string;
    qty: number;
    tax_amount: number;
    discount_amount: number;
  
}
