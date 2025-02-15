import appConfig from "@/appConfig";


export const fetchCartData = async (accessToken: string) => {
  try {
    const res = await fetch(`${appConfig.apiUrl}/carts/list`, {
      method: "GET",
      cache: "no-cache",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        headerapisecret: process.env.NEXT_PUBLIC_USER_API_SECRET_KEY!,
      },
    });

    const cartData = await res.json();
    const cartItems = cartData.data?.cartList[0]?.cart_items || [];

    // Fetch local cart data
    const localData = JSON.parse(window.localStorage.getItem("carts") || "[]");

    // Find items in window.localStorage that are not in the server cart
    const resUP = localData.filter(
      (obj1: { product_id: string; id: string }) =>
        !cartItems.some(
          (obj2: { product_id: string }) =>
            (obj1.product_id ? obj1.product_id : obj1.id) === obj2.product_id
        )
    );

    // Sync local items to the server
    if (resUP.length) {
      for (const item of resUP) {
        // await createToCart({
        //   id: item.id,
        //   quantity: 1,
        //   variant: item.variant_product,
        //   color: item.color,
        //   attributes: [],
        //   attribute_values: [],
        // });
      }
    }

    // Update local storage with the latest cart data
    window.localStorage.setItem("carts", JSON.stringify(cartItems));

    return cartItems; // Return for Redux update
  } catch (error) {
    console.error("Error syncing cart data:", error);
    return [];
  }
};
