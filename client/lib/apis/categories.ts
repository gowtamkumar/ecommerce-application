// const BASE_URL = process.env.NEXTAUTH_URL + "/api/products";
// 'use clent'

export async function GetAllCategories() {
  console.log("test server", process.env.NEXT_SERVER_URL);

  try {
    // const { api } = params
    // const session = await getSession()

    // const session = await getServerSession(authOptions);
    // console.log("🚀 ~ session:", session);
    const res = await fetch(
      `${process.env.NEXT_SERVER_URL}/api/v1/categories/all`,
      {
        next: { revalidate: 30 },
      }
    );

    if (!res.ok) {
      console.log("Failed to fetch data");
    }
    const result = await res.json();
    return result;
  } catch (error) {
    // console.log("🚀 ~ error:", error);
    console.log("Failed to fetch data");
  }
}
