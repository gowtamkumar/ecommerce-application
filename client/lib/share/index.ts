export function productDiscountCalculation(value: any) {
  const price = +value.selectProductVariant?.price;
  const discount = value.discount;
  let taxAmount = (+price * (value?.tax?.value || 0)) / 100;

  let disAmount =
    discount?.discountType === "Percentage"
      ? ((+price + +taxAmount) * (discount.value || 0)) / 100
      : +discount?.value;
  return disAmount;
}
