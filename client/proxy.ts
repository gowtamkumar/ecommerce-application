// /middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "./auth";

export async function proxy(req: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    const signInUrl = new URL("/login", req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard((?!api|_next/static|_next/image|favicon.ico).*)"],
};
