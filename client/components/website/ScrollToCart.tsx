"use client";

import { selectCart } from "@/redux/features/cart/cartSlice";
import React from "react";
import { FaBagShopping } from "react-icons/fa6";
import { useSelector } from "react-redux";

const ScrollToCart: React.FC = () => {
	const cart = useSelector(selectCart);
	console.log("cart?.carts?.cartSummary", cart?.carts?.cartSummary);

	return (
		<button
			className="z-50 fixed  bottom-1/3 -right-8 transform -translate-x-1/2 shadow-lg transition-all"
			aria-label="Scroll to Cart"
		>
			<div className="flex flex-col gap-1 rounded-sm items-center justify-center text-black bg-gray-200 ">
				<FaBagShopping color="black" size={20} className="mt-1" />
				<span className="text-sm">{cart?.carts?.cartSummary?.totalQty} Items</span>
				<span className="text-sm bg-blue-500 rounded-sm p-2 text-white">
				৳ {cart?.carts?.cartSummary?.subTotal}
				</span>
			</div>
		</button>
	);
};

export default ScrollToCart;
