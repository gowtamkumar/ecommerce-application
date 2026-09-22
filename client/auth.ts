import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import appConfig from "./appConfig";
import { authConfig } from "./config.auth";

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  trustHost: true,
  providers: [
    CredentialsProvider({
      name: "credentials",

      async authorize(credentials: any) {
        const res = await fetch(`${appConfig.apiUrl}/auth/login`, {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" },
        });
        const user = await res.json();
        try {
          if (res.ok && user.data) {
            const newuser = {
              ...user.data,
              accessToken: user.accessToken,
              refreshToken: user.refreshToken,
            };
            return newuser;
          } else {
            throw new Error("Invalid Login Credentials");
          }
        } catch (error) {
          console.error("Failed to parse response as JSON:", error);
          throw new Error("Invalid response from server");
        }
      },
    }),
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,

      async profile(profile: any) {
        // Check if profile.sub exists
        if (!profile.sub) {
          throw new Error(
            "Profile id is missing in Google OAuth profile response",
          );
        }
        const newUser = {
          name: profile.name,
          email: profile.email,
          avatar: profile.picture,
          provider_id: profile.sub,
        };

        const res = await fetch(`${appConfig.apiUrl}/auth/get-user-by-email`, {
          method: "POST",
          body: JSON.stringify(newUser),
          headers: { "Content-Type": "application/json" },
        });
        const user = await res.json();
        return user.data;
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,

      async profile(profile: { name: any; email: any }) {
        const newUser = {
          name: profile.name,
          email: profile.email,
        };
        const res = await fetch(`${appConfig.apiUrl}/auth/get-user-by-email`, {
          method: "POST",
          body: JSON.stringify(newUser),
          headers: { "Content-Type": "application/json" },
        });
        const user = await res.json();
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

  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET, // environment variable should be server and client same
  session: {
    strategy: "jwt",
    maxAge: (Number(process.env.JWT_EXPIRES) || 24) * 60 * 60,
  }, // Matches backend JWT_EXPIRES (default 24h)
  // debug: true,
  callbacks: {
    async session({ session, token }: any) {
      if (token) {
        session.user = {
          ...token.user,
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
        };
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        session.error = token.error;
      }
      return session;
    },
    async jwt({ token, user, account }: any) {
      // Initial sign in
      if (user && account) {
        const accessTokenExpires = getTokenExpiry(user.accessToken);
        return {
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires,
          user: {
            ...user,
            accessToken: user.accessToken,
            refreshToken: user.refreshToken,
          },
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },
  },
});

function getTokenExpiry(jwtToken?: string): number {
  if (!jwtToken) return Date.now() + 15 * 60 * 1000;
  try {
    const parts = jwtToken.split(".");
    if (parts.length === 3) {
      const payloadBase64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const decodedJson = JSON.parse(
        typeof window === "undefined"
          ? Buffer.from(payloadBase64, "base64").toString("utf-8")
          : atob(payloadBase64),
      );
      if (decodedJson.exp) {
        // Expire 2 minutes before actual JWT expiration to avoid boundary race conditions
        return decodedJson.exp * 1000 - 2 * 60 * 1000;
      }
    }
  } catch (err) {
    console.error("Error parsing JWT exp:", err);
  }
  return Date.now() + 23 * 60 * 60 * 1000;
}

const pendingRefreshes = new Map<string, Promise<any>>();

async function refreshAccessToken(token: any) {
  const currentRefreshToken = token.refreshToken;
  if (!currentRefreshToken) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }

  // Deduplicate concurrent refresh requests for the same refresh token
  if (pendingRefreshes.has(currentRefreshToken)) {
    try {
      const result = await pendingRefreshes.get(currentRefreshToken);
      return {
        ...token,
        ...result,
      };
    } catch (err) {
      return {
        ...token,
        error: "RefreshAccessTokenError",
      };
    }
  }

  const refreshPromise = (async () => {
    try {
      const response = await fetch(`${appConfig.apiUrl}/auth/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken: currentRefreshToken,
        }),
      });

      const refreshedTokens = await response.json();

      if (!response.ok) {
        throw refreshedTokens;
      }

      const newAccessToken = refreshedTokens.accessToken;
      const newRefreshToken =
        refreshedTokens.refreshToken ?? currentRefreshToken;
      const newExpiry = getTokenExpiry(newAccessToken);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        accessTokenExpires: newExpiry,
        user: {
          ...token.user,
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
        error: undefined,
      };
    } catch (error: any) {
      console.error("RefreshAccessTokenError", error);

      // If it's a network error or server 5xx issue, avoid immediately dropping the user's session
      if (
        error instanceof TypeError ||
        (error?.status && error.status >= 500)
      ) {
        return {
          accessTokenExpires: Date.now() + 30 * 1000, // Retry in 30 seconds
        };
      }

      throw error;
    } finally {
      setTimeout(() => {
        pendingRefreshes.delete(currentRefreshToken);
      }, 2000);
    }
  })();

  pendingRefreshes.set(currentRefreshToken, refreshPromise);

  try {
    const result = await refreshPromise;
    return {
      ...token,
      ...result,
    };
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}
