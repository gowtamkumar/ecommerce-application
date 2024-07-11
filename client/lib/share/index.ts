export function productDiscountCalculation(value: {
  selectProductVarient: { price: string | number };
  discount: { discountType: string; value: number };
}) {
  const price = +value.selectProductVarient?.price;
  const discount = value.discount;
  const dis =
    discount?.discountType === "Percentage"
      ? (price * (discount.value || 0)) / 100
      : +discount?.value;
  return dis;
}
