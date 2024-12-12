"use client";
import { selectCart } from "@/redux/features/cart/cartSlice";
import Link from "next/link";
import { useSelector } from "react-redux";

export default function CartTotal() {
  const cart = useSelector(selectCart);


  // const [cartResult, setCartResult] = useState<CartResult>({
  //   total: 0,
  //   total_qty: 0,
  //   total_tax: 0,
  //   total_discount: 0,
  // });

  // useEffect(() => {
  //   async function calculateCart() {
  //     const result = await cartCalculationFun(cart.carts);
  //     setCartResult(result);
  //   }

  //   calculateCart();
  // }, [cart.carts]);


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
        <div className="flex justify-between border-b pb-2 mb-2">
          <h2 className="text-xl font-bold mb-4">Cart totals</h2>
          <div className="flex items-center justify-center">
            <p>Total Quantity</p>
            <p className="w-5 rounded-full bg-bioxin-accent text-center">
              {totalQty ? totalQty : 0}
            </p>
          </div>
        </div>
        <div className="flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold text-2xl">৳{+total.toFixed(2)}</span>
        </div>
        <Link
          href="/checkout"
          className="rounded md:ml-1 flex justify-center w-full"
        >
          Proceed To Checkout
        </Link>
      </div>
    </div>
  );
}
