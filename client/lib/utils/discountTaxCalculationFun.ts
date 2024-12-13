import { DiscountTaxCalculationFun } from "../types/order";

export const discountTaxCalculationFun = async (
  value: DiscountTaxCalculationFun
): Promise<{ discountAmount: number; taxAmount: number }> => {
  let discount = value.discount; // The percentage you want to calculate

  let discountAmount =
    discount?.discountType === "Percentage"
      ? (+value.unitPrice * (discount?.value || 0)) / 100
      : +discount?.value || 0;

  let taxAmount = (+value.unitPrice * (+value.tax || 0)) / 100;

  return {
    discountAmount,
    taxAmount,
  };
};
