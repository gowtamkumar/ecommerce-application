import { selectCart } from "@/redux/features/cart/cartSlice";
import { useSelector } from "react-redux";

export default function CartTotal() {
  const cart = useSelector(selectCart);

  const { total, totalQty } = cart.carts?.reduce(
    (pre: any, curr: any) => {
      return {
        total: +pre.total + (+curr.price || 0) * (+curr.qty || 0),
        totalQty: +pre.totalQty + +curr.qty,
      };
    },
    {
      total: 0,
      totalQty: 0,
    }
  );
  return (
    <div className="md:flex justify-between py-20">
      <div className="md:w-1/2"></div>

      <div className="border border-gray-200 p-4 rounded shadow-sm md:w-1/2">
        <h2 className="text-xl font-bold mb-4">Cart totals</h2>
        <div className="flex justify-between border-b pb-2 mb-2">
          <span>Subtotal</span>
          <span>৳1,600.00</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold text-2xl">৳1,600.00</span>
        </div>
        <button className="btn-primary-bioxin w-full mt-4 rounded">
          Proceed To Checkout
        </button>
      </div>
    </div>
  );
}
