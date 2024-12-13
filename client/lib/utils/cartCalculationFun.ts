export interface CartCalculationFun {
  price: string; // Unit price as a string
  qty: number; // Quantity as a number
  disAmount: string | number; // Discount amount as string or number
  taxAmount: string | number; // Tax amount as string or number
}

export interface CartResult {
  total: number;
  totalQty: number;
  totalTax: number;
  totalDiscount: number;
}

export const cartCalculationFun = async (
  value: CartCalculationFun[]
): Promise<CartResult> => {
  const result = value.reduce(
    (pre, curr) => {
      // Ensure all values are converted to numbers for calculations
      const unitPrice = parseFloat(curr.price) || 0;
      const discountAmount = parseFloat(curr.disAmount as string) || 0;
      const taxAmount = parseFloat(curr.taxAmount as string) || 0;

      return {
        total: pre.total + unitPrice * (curr.qty || 0),
        totalQty: pre.totalQty + (curr.qty || 0),
        totalDiscount: pre.totalDiscount + discountAmount * (curr.qty || 0),
        totalTax: pre.totalTax + taxAmount * (curr.qty || 0),
      };
    },
    {
      total: 0,
      totalQty: 0,
      totalDiscount: 0,
      totalTax: 0,
    }
  );

  // Simulate an asynchronous operation
  await new Promise((resolve) => setTimeout(resolve, 10));

  return result;
};
