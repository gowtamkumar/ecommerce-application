import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },

  // pages: {
  //   signIn: "/api/auth/signin",
  //   signOut: "/auth/signout",
  //   error: "/auth/error",
  //   verifyRequest: "/auth/verify-request",
  //   newUser: "/auth/new-user",
  // },
  callbacks: {
    async authorized({ request, auth }) {
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
  providers: [],
} satisfies NextAuthConfig;
