import { DiscountTaxCalculationFun } from "../types/order";

export const discountTaxCalculationFun = async (
  value: DiscountTaxCalculationFun
): Promise<{ disAmount: number; taxAmount: number }> => {
  console.log("🚀 ~ value fasdfasdf:", value);

  let discount = value.discount; // The percentage you want to calculate

  let disAmount =
    discount?.discountType === "Percentage"
      ? (+value.salePrice * (discount?.value || 0)) / 100
      : +discount?.value || 0;

  let taxAmount = (+value.salePrice * (+value.tax || 0)) / 100;

  return {
    disAmount,
    taxAmount,
  };
};
