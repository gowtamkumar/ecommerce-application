'use server'
export async function GetProducts() {
  try {
    // const { api } = params
    // const session = await getSession()

    // const session = await getServerSession(authOptions);
    // console.log("🚀 ~ session:", session);
    const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/products`, {
      next: { revalidate: 30 },
    });
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
