import { getCartLists } from "../apis/cart";

export const fetchCartData = async () => {
  try {
    const cartData = await getCartLists();
    console.log("cart sync");

    // const cartItems = cartData.data?.cartList || [];

    // Fetch local cart data
    // const localData = JSON.parse(window.localStorage.getItem("carts") || "[]");
    // console.log("localData", localData);

    // // Find items in window.localStorage that are not in the server cart
    // const resUP = localData?.cartList?.filter(
    //   (obj1: { productId: string; id: string }) =>
    //     !cartItems.some(
    //       (obj2: { productId: string }) =>
    //         (obj1.productId ? obj1.productId : obj1.id) === obj2.productId
    //     )
    // );

    // Sync local items to the server
    // if (resUP?.length) {
    //   for (const item of resUP) {
    //     await createToCart({
    //       id: item.id,
    //       quantity: 1,
    //       variant: item.variant_product,
    //       color: item.color,
    //       attributes: [],
    //       attribute_values: [],
    //     });
    //   }
    // }

    // Update local storage with the latest cart data
    window.localStorage.setItem("carts", JSON.stringify(cartData.data));

    return cartData.data; // Return for Redux update
  } catch (error) {
    console.error("Error syncing cart data:", error);
    return [];
  }
};
