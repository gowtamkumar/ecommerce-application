// import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  callbacks: {
    async authorized({ request, auth }: any) {
      const url = request.nextUrl;
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = url.pathname.startsWith("/dashboard");
      const isAuthPage = url.pathname === "/login" || url.pathname === "/register";

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      } 
      
      if (isAuthPage && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", url));
      }

      return true;
    },
  },
};
