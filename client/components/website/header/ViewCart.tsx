"use client";
import { useCurrency } from "@/context/CurrencyContext";
import { deleteCart, getCartLists } from "@/lib/apis/cart";
import { getUploadImageUrl } from "@/lib/utils/imageUrl";
import { replaceCart, selectCart } from "@/redux/features/cart/cartSlice";
import { selectGlobal, setDrawarCart } from "@/redux/features/global/globalSlice";
import { Button, Divider } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiArrowRight, FiShoppingBag, FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingCartOutlined, DeleteOutlined, ArrowRightOutlined } from "@ant-design/icons";

export default function ViewCart() {
  const cart = useSelector(selectCart);
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();
  const router = useRouter();
  const { formatPrice } = useCurrency();

  const handleRemove = async (item: any) => {
    const cartId = item.id;
    const removeDartData = await deleteCart(cartId);
    if (removeDartData.success) {
      const getCartList = await getCartLists();
      dispatch(replaceCart(getCartList.data || []));
    }
  };

  const cartList = cart?.carts?.cartList || [];
  const subTotal = cart?.carts?.cartSummary?.subTotal || 0;

  const freeShippingThreshold = global.setting?.orderFreeShippingAmount || 5000;
  const progress = Math.min((subTotal / freeShippingThreshold) * 100, 100);
  const remainingForFreeShipping = freeShippingThreshold - subTotal;

  if (cartList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-10 space-y-8 animate-in fade-in duration-700">
        <div className="relative">
           <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 shadow-inner">
              <ShoppingCartOutlined className="text-4xl text-gray-200" />
           </div>
        </div>
        <div>
           <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-900 mb-2">Your Bag is Empty</h3>
           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest max-w-[180px] mx-auto leading-relaxed">
              Discover our latest premium collection today.
           </p>
        </div>
        <Button
          type="primary"
          size="large"
          className="h-12 px-10 rounded-2xl font-black text-[10px] uppercase tracking-widest !bg-gray-900 !border-none shadow-xl shadow-gray-200"
          onClick={() => {
            dispatch(setDrawarCart(false));
            router.push("/products");
          }}
        >
          Start Exploring
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Free Shipping Indicator */}
      <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-50">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            {progress === 100 ? "Free Shipping Unlocked" : `Add ${formatPrice(remainingForFreeShipping)} for Free Shipping`}
          </span>
          <span className="text-[10px] font-black text-gray-900">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-white rounded-full h-1 p-0.5 border border-gray-100 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${progress === 100 ? 'bg-green-500' : 'bg-gray-900'}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Cart Items List */}
      <div className="flex-grow overflow-y-auto px-6 py-4 space-y-4">
        {cartList.map((item: any, index: number) => (
          <div
            key={item.id}
            className="group relative flex gap-4 p-4 rounded-[1.5rem] bg-white border border-gray-50 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-100/50 transition-all duration-500"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Thumbnail */}
            <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-50 border border-gray-100">
              <Image
                src={getUploadImageUrl(item.thumbnailImage)}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="80px"
              />
            </div>

            {/* Info */}
            <div className="flex flex-1 flex-col justify-between py-1">
              <div>
                 <div className="flex justify-between items-start">
                    <h3 className="text-xs font-black text-gray-900 uppercase tracking-tight leading-tight line-clamp-2 pr-4">
                       {item.name}
                    </h3>
                    <button
                      onClick={() => handleRemove(item)}
                      className="text-gray-300 hover:text-red-500 transition-colors p-1"
                    >
                      <DeleteOutlined size={14} />
                    </button>
                 </div>
                 <div className="flex gap-2 mt-2">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded">Qty: {item.qty}</span>
                    {item?.size?.name && <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded">{item.size.name}</span>}
                 </div>
              </div>

              <div className="text-sm font-black text-gray-900 tracking-tighter">
                {formatPrice(item.subTotal)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Drawer Footer */}
      <div className="p-8 bg-gray-50 border-t border-gray-100 space-y-6">
        <div className="flex justify-between items-end">
           <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Subtotal</div>
              <div className="text-2xl font-black text-gray-900 tracking-tighter">
                {formatPrice(subTotal)}
              </div>
           </div>
           <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Taxes calculated at checkout</div>
        </div>

        <Button
          size="large"
          type="primary"
          className="w-full h-14 rounded-2xl text-xs font-black uppercase tracking-[0.2em] !bg-gray-900 border-none shadow-xl shadow-gray-200 flex items-center justify-center gap-3"
          onClick={() => {
            dispatch(setDrawarCart(false))
            router.push("/checkout")
          }}
        >
          <span>Begin Checkout</span>
          <ArrowRightOutlined className="text-xs" />
        </Button>
      </div>
    </div>
  );
}
