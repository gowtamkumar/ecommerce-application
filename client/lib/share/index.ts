export function productDiscountCalculation(value: any) {
  console.log("🚀 ~ value:", value);
  const price = +value.selectProductVarient?.price;
  const discount = value.discount;
  let taxAmount = (+price * (value?.tax?.value || 0)) / 100;

  let disAmount =
    discount?.discountType === "Percentage"
      ? ((+price + +taxAmount) * (discount.value || 0)) / 100
      : +discount?.value;
  return disAmount;
}
