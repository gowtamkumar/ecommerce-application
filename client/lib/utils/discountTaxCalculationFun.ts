import { DiscountTaxCalculationFun } from "../types/order";

export const discountTaxCalculationFun = async (
  value: DiscountTaxCalculationFun
): Promise<{ discountAmount: number; taxAmount: number }> => {
  const discount = value.discount; // The percentage you want to calculate

  const discountAmount =
    discount?.discountStrategy === "Percentage"
      ? (+value.unitPrice * (discount?.value || 0)) / 100
      : +discount?.value || 0;

  const taxAmount = (+value.unitPrice * (+value.tax || 0)) / 100;

  return {
    discountAmount,
    taxAmount,
  };
};
