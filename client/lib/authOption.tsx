import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",

      async authorize(credentials: any) {
        const res = await fetch(
          `${process.env.NEXT_SERVER_URL}/api/v1/auth/login`,
          {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          }
        );

        const user = await res.json(); // Get response as text
        try {
          // const user = JSON.parse(text); // Attempt to parse as JSON
          if (res.ok && user.data) {
            const newuser = { ...user.data, accessToken: user.accessToken };
            return newuser;
          } else {
            throw new Error(user.error || "Invalid Login Credentials");
          }
        } catch (error) {
          console.error("Failed to parse response as JSON:", error);
          throw new Error("Invalid response from server");
        }

        // const res = await fetch(
        //   `${process.env.NEXT_SERVER_URL}/api/v1/auth/login`,
        //   {
        //     method: "POST",
        //     body: JSON.stringify(credentials),
        //     headers: { "Content-Type": "application/json" },
        //   }
        // );
        // const user = await res.json();
        // // console.log("🚀 ~ user:", user)
        // if (res.ok && user.data) {
        //   const newuser = { ...user.data, accessToken: user.accessToken };
        //   return newuser;
        // } else {
        //   throw new Error("Invalid Login Credentials");
        // }
      },
    } as any),
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,

      async profile(profile: any) {
        // console.log("🚀 ~ profile ge:", profile);

        const newUser = {
          name: profile.name,
          email: profile.email,
        };

        const res = await fetch(
          `${process.env.NEXT_SERVER_URL}/api/v1/auth/get-user-by-email`,
          {
            method: "POST",
            body: JSON.stringify(newUser),
            headers: { "Content-Type": "application/json" },
          }
        );

        const user = await res.json(); // Get response as text
        // console.log("🚀 ~ user sdfasdf:", user)

        // // Connect to the database
        // // await connectDB();

        // // Check if the user already exists
        // let user = await User.findOne({ email: profile.email });
        // // If not, create a new user
        // if (!user) {
        //   user = await User.create({
        //     name: profile.name,
        //     email: profile.email,
        //     image: profile.picture,
        //     googleId: profile.id,
        //   });
        // }

        return user.data;
      },
    } as any),
  ],
  pages: {
    signIn: "/login",
  },

  // pages: {
  //   signIn: "/signin",
  //   signOut: "/auth/signout",
  //   error: "/auth/error",
  //   verifyRequest: "/auth/verify-request",
  //   newUser: "/auth/new-user",
  // },

  secret: "ecommerce-application", // environment variable should be server and client same
  session: { strategy: "jwt", maxAge: 1 * 24 * 60 * 60 }, // 1 day
  // debug: true,
  callbacks: {
    async session({ session, token, user }) {
      return {
        ...session,
        user: token.user,
        // token,
        token: { exp: token.exp, iat: token.iat, jti: token.jti },
      };
    },
    async jwt({ token, user, account, profile }: any) {
      // console.log("🚀 ~ user:", user)
      // console.log("🚀 ~ account:", account);
      // console.log("🚀 ~ token:", token);
      // const tokena = await jwt.sign(
      //   { id: token.id, name: token.name, username: token.username, role: token.role },
      //   process.env.NEXTAUTH_SECRET!,
      //   {
      //     expiresIn: process.env.JWT_EXPIRES + "h",
      //   }
      // );

      // accessToken: token.user.accessToken 

      if (typeof user !== "undefined") {
        return {
          ...token,
          user,
        };
      }
      return token;
    },
  },
};
