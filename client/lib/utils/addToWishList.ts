import { saveWishlist } from "../apis/wishlist";
import { errorNotification, successNotification } from "./notification";

export async function AddToWishlist(productId: number) {
  try {
    const res = await saveWishlist({ productId });
    console.log("res", res);

    if (res.success) {
      successNotification({ message: res.message });
    }

    if (!res.success) {
      errorNotification({ message: res.message });
    }
  } catch (error) {
    console.log("error", error);
  }
}
