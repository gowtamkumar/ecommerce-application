import { message } from "antd";
import { saveWishlist } from "../apis/wishlist";

export async function AddToWishlist(productId: number) {
  console.log("productId", productId);

  try {
    const res = await saveWishlist({ productId });
    console.log("res", res);

    if (res.success) {
      message.success(`${res.message}`);
    }

    if (!res.success) {
      message.success(`${res.message}`);
    }
  } catch (error) {
    console.log("error", error);
  }
}
