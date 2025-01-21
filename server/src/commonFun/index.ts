// const validateCoupon = async (code: any, cartTotal: any) => {
//   const coupon = await coupon.findOne({ code });

//   if (!coupon || !coupon.active) {
//     throw new Error('Coupon is invalid or inactive');
//   }

//   if (coupon.expiry_date < new Date()) {
//     throw new Error('Coupon has expired');
//   }

//   if (cartTotal < coupon.min_order_value) {
//     throw new Error('Order does not meet the minimum value for this coupon');
//   }

//   if (coupon.usage_limit <= 0) {
//     throw new Error('Coupon usage limit exceeded');
//   }

//   return coupon;
// };