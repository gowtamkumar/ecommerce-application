"use client";
import { getUploadImageUrl } from "@/lib/utils/imageUrl";
import { deleteCart, getCartLists } from "@/lib/apis/cart";
import { replaceCart, selectCart } from "@/redux/features/cart/cartSlice";
import { Button } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { TiDeleteOutline } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";

export default function ViewCart() {
  const cart = useSelector(selectCart);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleRemove = async (item: any) => {
    const cartId = item.id;
    const removeDartData = await deleteCart(cartId);
    if (removeDartData.success) {
      const getCartList = await getCartLists();
      dispatch(replaceCart(getCartList.data || []));
    }
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex flex-col flex-grow gap-6 overflow-y-auto">
        {(cart?.carts?.cartList || []).map((item: any) => {
          return (
            <div
              key={item.id}
              className="text-black flex gap-4 items-center justify-between py-3 border-b"
            >
              <div>
                <Image
                  src={getUploadImageUrl(item.thumbnailImage)}
                  alt={item.name}
                  width={100}
                  height={100}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              <div className="flex justify-between">
                <div>
                  <p>{item?.name?.slice(0, 60)}</p>
                  <p>
                    {item.qty} × ৳ {item.subTotal}
                  </p>
                </div>
                <div className="px-5">
                  <TiDeleteOutline
                    size={22}
                    className="cursor-pointer text-gray-500"
                    onClick={() => handleRemove(item)}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <div className="flex justify-between">
          <p>Subtotal:</p>
          <p className="font-bold text-2xl">
            ৳ {cart?.carts?.cartSummary?.subTotal}
          </p>
        </div>
        <Button
          className="w-full"
          onClick={() => {
            // dispatch(setOpen(false));
            // dispatch(setDrawarCart(false));
            router.push("/checkout");
          }}
        >
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}
