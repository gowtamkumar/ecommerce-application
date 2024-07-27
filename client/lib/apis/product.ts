"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../authOption";

export async function saveProduct(data: any) {
  const session = await getServerSession(authOptions);
  const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/products`, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.user.accessToken}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

interface getParams {
  brandId?: any;
  categoryId?: any;
  colorId?: any;
  maxPrice?: string;
  minPrice?: string;
  search?: string;
  lowPrice?: string;
  highPrice?: string;
  status?: boolean;
}

export async function getProducts() {
  const session = await getServerSession(authOptions);

  try {
    const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/products`, {
      cache: "no-cache",
      headers: {
        Authorization: `Bearer ${session?.user.accessToken}`,
      },
    });
    if (!res.ok) {
      console.log("Failed to fetch data");
    }
    const result = await res.json();
    return result;
  } catch (error) {
    console.log("Failed to fetch data");
  }
}

export async function getPublicProducts(params: getParams) {
  // const session = await getServerSession(authOptions);
  const {
    brandId,
    colorId,
    maxPrice,
    minPrice,
    search,
    lowPrice,
    highPrice,
    categoryId,
  }: getParams = params;

  let queryString = "status=Active&";

  if (brandId?.length > 0) {
    queryString += `brandId=${brandId}&`;
  }

  // if (categoryId.length > 0) {
  //   queryString += `categoryId=${categoryId.join(",")}${categoryId && "&"}`;
  // }

  if (categoryId?.length > 0) {
    queryString += `categoryId=${categoryId}&`;
  }

  if (colorId?.length > 0) {
    queryString += `colorId=${colorId}&`;
  }

  if (maxPrice) {
    queryString += `maxPrice=${maxPrice}&`;
  }

  if (minPrice) {
    queryString += `minPrice=${minPrice}&`;
  }

  if (lowPrice) {
    queryString += `lowPrice=${lowPrice}&`;
  }

  if (highPrice) {
    queryString += `highPrice=${highPrice}&`;
  }

  if (search) {
    queryString += `search=${search}&`;
  }

  console.log("🚀 ~ lowPrice:", queryString);

  try {
    const res = await fetch(
      `${process.env.NEXT_SERVER_URL}/api/v1/products?${queryString}`
    );
    if (!res.ok) {
      console.log("Failed to fetch data");
    }
    const result = await res.json();
    return result;
  } catch (error) {
    console.log("Failed to fetch data");
  }
}

// export async function getPublicProducts() {
//   try {
//     const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/products`);
//     if (!res.ok) {
//       console.log("Failed to fetch data");
//     }
//     const result = await res.json();
//     return result;
//   } catch (error) {
//     console.log("Failed to fetch data");
//   }
// }

export async function getProduct(id: string) {
  const session = await getServerSession(authOptions);
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/products/${id}`,
    {
      method: "GET",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user.accessToken}`,
      },
    }
  );
  return res.json();
}

export async function updateProduct(data: any) {
  const session = await getServerSession(authOptions);
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/products/${data.id}`,
    {
      method: "PATCH",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user.accessToken}`,
      },
      body: JSON.stringify(data),
    }
  );
  return res.json();
}

export async function deleteProduct(id: string) {
  const session = await getServerSession(authOptions);
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/products/${id}`,
    {
      method: "DELETE",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user.accessToken}`,
      },
    }
  );
  return res.json();
}
