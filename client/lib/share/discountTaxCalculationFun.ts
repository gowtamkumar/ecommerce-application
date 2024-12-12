import { DiscountTaxCalculationFun } from "../types/order";

export const discountTaxCalculationFun = (value: DiscountTaxCalculationFun) => {
  let discount = +value.discount; // The percentage you want to calculate
  let discount_amount =
    value.discount_type === "percent"
      ? (+value.unit_price * discount) / 100
      : +discount;

  let tax_amount = (+value.unit_price * +value.tax) / 100;

  return {
    discount_amount,
    tax_amount,
  };
};