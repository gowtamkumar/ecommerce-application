export interface CartCalculationFun {
  unitPrice: string; // Unit price as a string
  qty: number; // Quantity as a number
  discountAmount: string | number; // Discount amount as string or number
  taxAmount: string | number; // Tax amount as string or number
}

export interface CartResult {
  total: number;
  totalQty: number;
  totalTax: number;
  discountedPrice: number | string;
  subTotal: number;
}

export const cartCalculationFun = async (value: any) => {
  const result = value.reduce(
    (pre: any, curr: any) => {
      // Ensure all values are converted to numbers for calculations
      const unitPrice = +curr.discountedPrice * (curr.qty || 0);
      const taxAmount = +curr.taxAmount + (curr.qty || 0);

      return {
        total: pre.total + unitPrice,
        totalQty: pre.totalQty + (curr.qty || 0),
        totalTax: pre.totalTax + taxAmount,
        subTotal: pre.subTotal + unitPrice + +taxAmount,
      };
    },
    {
      total: 0,
      totalQty: 0,
      totalTax: 0,
      subTotal: 0,
    }
  );

  // Simulate an asynchronous operation
  await new Promise((resolve) => setTimeout(resolve, 10));

  return result;
};
