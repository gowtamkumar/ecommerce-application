import { authOptions } from "@/lib/authOption";
import NextAuth from "next-auth";
import type, { NextAuthOptions } from "next-auth";

const handler: NextAuthOptions = NextAuth(authOptions);

export { handler  };
