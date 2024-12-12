export interface CartCalculationFun {
  unit_price: string; // Unit price as a string
  qty: number; // Quantity as a number
  discount_amount: string | number; // Discount amount as string or number
  tax_amount: string | number; // Tax amount as string or number
}

export interface CartResult {
  total: number;
  total_qty: number;
  total_tax: number;
  total_discount: number;
}

export const cartCalculationFun = async (
  value: CartCalculationFun[]
): Promise<CartResult> => {
  const result = value.reduce(
    (pre, curr) => {
      // Ensure all values are converted to numbers for calculations
      const unitPrice = parseFloat(curr.unit_price) || 0;
      const discountAmount = parseFloat(curr.discount_amount as string) || 0;
      const taxAmount = parseFloat(curr.tax_amount as string) || 0;

      return {
        total: pre.total + unitPrice * (curr.qty || 0),
        total_qty: pre.total_qty + (curr.qty || 0),
        total_discount: pre.total_discount + discountAmount * (curr.qty || 0),
        total_tax: pre.total_tax + taxAmount * (curr.qty || 0),
      };
    },
    {
      total: 0,
      total_qty: 0,
      total_discount: 0,
      total_tax: 0,
    }
  );

  // Simulate an asynchronous operation
  await new Promise((resolve) => setTimeout(resolve, 10));

  return result;
};
