import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        console.log("🚀 ~ credentials:", credentials);
        // Add logic here to look up the user from the credentials supplied
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
        // console.log("dd", res);

        const user = await res.json();
        console.log("🚀 ~ user:", user);
        if (res.ok && user) {
          return user.data.user;
        } else {
          return null;
          throw new Error('Invalid Login Credentials')
        }
      },
    }),
  ],
});
