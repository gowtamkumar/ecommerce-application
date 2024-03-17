import { authConfig } from "@/config.auth";
import CredentialsProvider from "next-auth/providers/credentials";

interface AuthOptions {
  providers: any[]; // Adjust the type based on the actual provider type
  pages: {
    signIn: string;
    signOut: string;
    error: string;
    verifyRequest: string;
    newUser: string;
  };
  secret: string;
  session: {
    strategy: any;
    maxAge: any;
  };
  callbacks: {
    session: ({ session, token, apiToken }: any) => Promise<any>;
    jwt: ({ token, user, account, profile }: any) => Promise<any>;
    authorized: ({ request, auth }: any) => Promise<any>;
  };
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      async authorize(credentials: any) {
        // console.log("🚀 ~ credentials:", credentials);
        const res = await fetch(
          `${process.env.NEXT_SERVER_URL}/api/v1/auth/login`,
          {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          }
        );
        const user = await res.json();
        if (res.ok && user) {
          return user.data;
        } else {
          throw new Error("Invalid Login Credentials");
        }
      },
    } as any),
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/auth/new-user",
  },
  secret: process.env.NEXTAUTH_SECRET || "", // Adjust the type based on your environment variable
  session: { strategy: "jwt", maxAge: 1 * 24 * 60 * 60 }, // 1 day
  callbacks: {
    async session({ session, token, apiToken }: any) {
      const sanitizedToken = Object.keys(token).reduce((p: any, c: string) => {
        if (c !== "iat" && c !== "exp" && c !== "jti") {
          return { ...p, [c]: token[c] };
        } else {
          return p;
        }
      }, {});
      return {
        ...session,
        user: { ...sanitizedToken.user, token: sanitizedToken.token },
        token: { exp: token.exp, iat: token.iat, jti: token.jti },
      };
    },
    async jwt({ token, user, account, profile }: any) {
      if (typeof user !== "undefined") {
        return user;
      }
      return token;
    },
    async authorized({ request, auth }: any) {
      console.log("auth", auth);
      console.log("request", request);

      const url = request.nextUrl;
      const isLogined = auth?.user;
      const isOnDashboard = url.pathname.startsWith("/dashboard");
      if (isOnDashboard) {
        if (isLogined) return true;
        return false;
      } else if (isLogined) {
        return Response.redirect(new URL("/dashboard", url));
      }
      return true;
    },
  },
};
