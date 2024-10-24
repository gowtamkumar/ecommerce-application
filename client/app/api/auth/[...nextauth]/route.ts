import { authOptions } from "@/lib/authOption";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST };

// import { authOptions } from "@/lib/authOption";
// import { NextApiRequest, NextApiResponse } from "next";
// import NextAuth from "next-auth";

// const handler = async (req: NextApiRequest, res: NextApiResponse) => {
//   return await NextAuth(req, res, authOptions); // Ensure NextAuth is awaited
// }

// export { handler as GET, handler as POST };

