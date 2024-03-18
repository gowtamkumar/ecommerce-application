// import { NextRequest } from "next/server"

export { default } from "next-auth/middleware"

// export async function middleware(req: NextRequest) {
//   console.log("🚀 ~ req:", req.headers.get("authorization"))

// }

export const config = { matcher: ['/dashboard((?!api|_next/static|_next/image|favicon.ico).*)'] }