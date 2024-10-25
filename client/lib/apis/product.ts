"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../authOption";
import appConfig from "@/config";

// Function to handle API responses
async function handleResponse(res: Response) {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error: ${res.status} - ${errorText}`);
  }
  return res.json();
}

export async function saveProduct(data: any) {
  try {
    const session = await getServerSession(authOptions);
    const res = await fetch(`${appConfig.apiUrl}/api/v1/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
      body: JSON.stringify(data),
    });
    return await handleResponse(res);
  } catch (error) {
    console.error("Error in saveProduct:", error);
    throw error;
  }
}

interface GetParams {
  brandId?: string[];
  categoryId?: any;
  colorId?: string[];
  maxPrice?: string;
  minPrice?: string;
  search?: string;
  lowPrice?: string;
  highPrice?: string;
  discount?: number;
  rating?: string;
  status?: boolean;
}

export async function getProducts() {
  try {
    const session = await getServerSession(authOptions);
    const res = await fetch(`${appConfig.apiUrl}/api/v1/products`, {
      headers: {
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
    });
    return await handleResponse(res);
  } catch (error) {
    console.error("Error in getProducts:", error);
    throw error;
  }
}

export async function getPublicProducts(params: GetParams) {
  const {
    brandId,
    colorId,
    maxPrice,
    minPrice,
    search,
    lowPrice,
    highPrice,
    categoryId,
    rating,
    discount,
  } = params;

  const queryParams = new URLSearchParams({
    status: "Active",
    ...(brandId && { brandId: brandId.join(",") }),
    ...(categoryId && { categoryId: categoryId.join(",") }),
    ...(colorId && { colorId: colorId.join(",") }),
    ...(maxPrice && { maxPrice }),
    ...(minPrice && { minPrice }),
    ...(lowPrice && { lowPrice }),
    ...(highPrice && { highPrice }),
    ...(discount && { discount: discount.toString() }),
    ...(rating && { rating }),
    ...(search && { search }),
  });

  try {
    const res = await fetch(`${appConfig.apiUrl}/api/v1/products?${queryParams}`);
    return await handleResponse(res);
  } catch (error) {
    console.error("Error in getPublicProducts:", error);
    throw error;
  }
}

export async function getProduct(id: string) {
  try {
    const session = await getServerSession(authOptions);
    const res = await fetch(
      `${appConfig.apiUrl}/api/v1/products/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
      }
    );
    return await handleResponse(res);
  } catch (error) {
    console.error("Error in getProduct:", error);
    throw error;
  }
}

export async function updateProduct(data: any) {
  try {
    const session = await getServerSession(authOptions);
    const res = await fetch(
      `${appConfig.apiUrl}/api/v1/products/${data.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: JSON.stringify(data),
      }
    );
    return await handleResponse(res);
  } catch (error) {
    console.error("Error in updateProduct:", error);
    throw error;
  }
}

export async function deleteProduct(id: string) {
  try {
    const session = await getServerSession(authOptions);
    const res = await fetch(
      `${appConfig.apiUrl}/api/v1/products/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
      }
    );
    return await handleResponse(res);
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    throw error;
  }
}

// "use server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "../authOption";
// import appConfig from "@/config";

// export async function saveProduct(data: any) {
//   const session = await getServerSession(authOptions);
//   const res = await fetch(`${appConfig.apiUrl}/api/v1/products`, {
//     method: "POST",
//     cache: "no-cache",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${session?.user?.session?.user?.accessToken}`,
//     },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// }

// interface getParams {
//   brandId?: any;
//   categoryId?: any;
//   colorId?: any;
//   maxPrice?: string;
//   rating?: string;
//   minPrice?: string;
//   search?: string;
//   lowPrice?: string;
//   highPrice?: string;
//   discount?: number;
//   status?: boolean;
// }

// export async function getProducts() {
//   const session = await getServerSession(authOptions);

//   try {
//     const res = await fetch(`${appConfig.apiUrl}/api/v1/products`, {
//       headers: {
//         Authorization: `Bearer ${session?.user?.session?.user?.accessToken}`,
//       },
//     });
//     if (!res.ok) {
//       console.log("Failed to fetch data");
//     }
//     const result = await res.json();
//     return result;
//   } catch (error) {
//     console.log("Failed to fetch data");
//   }
// }

// export async function getPublicProducts(params: getParams) {
//   // const session = await getServerSession(authOptions);
//   const {
//     brandId,
//     colorId,
//     maxPrice,
//     minPrice,
//     search,
//     lowPrice,
//     highPrice,
//     categoryId,
//     rating,
//     discount,
//   }: getParams = params;

//   let queryString = "status=Active&";

//   if (brandId?.length > 0) {
//     queryString += `brandId=${brandId}&`;
//   }

//   // if (categoryId.length > 0) {
//   //   queryString += `categoryId=${categoryId.join(",")}${categoryId && "&"}`;
//   // }

//   if (categoryId?.length > 0) {
//     queryString += `categoryId=${categoryId}&`;
//   }

//   if (colorId?.length > 0) {
//     queryString += `colorId=${colorId}&`;
//   }

//   if (maxPrice) {
//     queryString += `maxPrice=${maxPrice}&`;
//   }

//   if (minPrice) {
//     queryString += `minPrice=${minPrice}&`;
//   }

//   if (lowPrice) {
//     queryString += `lowPrice=${lowPrice}&`;
//   }

//   if (highPrice) {
//     queryString += `highPrice=${highPrice}&`;
//   }

//   if (discount) {
//     queryString += `discount=${discount}&`;
//   }

//   if (rating) {
//     queryString += `rating=${rating}&`;
//   }

//   if (search) {
//     queryString += `search=${search}&`;
//   }

//   try {
//     const res = await fetch(
//       `${appConfig.apiUrl}/api/v1/products?${queryString}`
//     );
//     if (!res.ok) {
//       console.log("Failed to fetch data");
//     }
//     const result = await res.json();
//     return result;
//   } catch (error) {
//     console.log("Failed to fetch data");
//   }
// }

// // export async function getPublicProducts() {
// //   try {
// //     const res = await fetch(`${appConfig.apiUrl}/api/v1/products`);
// //     if (!res.ok) {
// //       console.log("Failed to fetch data");
// //     }
// //     const result = await res.json();
// //     return result;
// //   } catch (error) {
// //     console.log("Failed to fetch data");
// //   }
// // }

// export async function getProduct(id: string) {
//   const session = await getServerSession(authOptions);
//   const res = await fetch(
//     `${appConfig.apiUrl}/api/v1/products/${id}`,
//     {
//       method: "GET",
//       cache: "no-cache",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${session?.user?.session?.user?.accessToken}`,
//       },
//     }
//   );
//   return res.json();
// }

// export async function updateProduct(data: any) {
//   const session = await getServerSession(authOptions);
//   const res = await fetch(
//     `${appConfig.apiUrl}/api/v1/products/${data.id}`,
//     {
//       method: "PATCH",
//       cache: "no-cache",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${session?.user?.session?.user?.accessToken}`,
//       },
//       body: JSON.stringify(data),
//     }
//   );
//   return res.json();
// }

// export async function deleteProduct(id: string) {
//   const session = await getServerSession(authOptions);
//   const res = await fetch(
//     `${appConfig.apiUrl}/api/v1/products/${id}`,
//     {
//       method: "DELETE",
//       cache: "no-cache",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${session?.user?.session?.user?.accessToken}`,
//       },
//     }
//   );
//   return res.json();
// }
