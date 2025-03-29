export function productDiscountCalculation(value: any) {
  const price = +value.defaultProduct?.unitPrice;
  const discount = value.discount;
  let taxAmount = (+price * (+value?.tax?.value || 0)) / 100;

  let discountAmount =
    discount?.discountStrategy === "Percentage"
      ? ((+price + +taxAmount) * (+discount.value || 0)) / 100
      : +discount?.value;
  return discountAmount;
}
