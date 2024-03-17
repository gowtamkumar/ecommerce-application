import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authConfig } from "./config.auth";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      type: "credentials",
      name: "credentials",

      // credentials: {
      //   username: { label: "Username", type: "text", placeholder: "jsmith" },
      //   password: { label: "Password", type: "password" },
      // },

      async authorize(credentials, req) {
        const res = await fetch(
          `${process.env.NEXT_SERVER_URL}/api/v1/auth/login`,
          {
            method: "POST",
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
            headers: { "Content-Type": "application/json" },
          }
        );
        const user = await res.json();
        console.log("🚀 ~ user:", user);
        if (res.ok && user) {
          return user.data.user;
        } else {
          return null;
          // throw new Error("Invalid Login Credentials");
        }

      },
    }),
  ],
  // pages: {
  //   signIn: "/api/auth/signin",
  //   signOut: "/auth/signout",
  //   error: "/auth/error",
  //   verifyRequest: "/auth/verify-request",
  //   newUser: "/auth/new-user",
  // },
  secret: process.env.NEXTAUTH_SECRET,
  // trustHost: true,
});
