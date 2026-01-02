// import { withAuth } from "next-auth/middleware";
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export default withAuth(
//   function middleware(request) {
//     const { pathname } = request.nextUrl;

//     // Redirect root to home
//     if (pathname === "/") {
//       return NextResponse.redirect(new URL("/home", request.url));
//     }

//     const response = NextResponse.next();
//     response.headers.set("x-pathname", pathname);
//     return response;
//   },
//   {
//     callbacks: {
//       authorized: ({ token, req }) => {
//         const { pathname } = req.nextUrl;

//         // Allow public routes
//         const publicRoutes = ["/home", "/login", "/register"];
//         if (publicRoutes.some((route) => pathname.startsWith(route))) {
//           return true;
//         }

//         // Protected routes require valid token
//         const protectedRoutes = ["/profile", "/settings", "/orders"];
//         if (protectedRoutes.some((route) => pathname.startsWith(route))) {
//           return !!token; // User must be authenticated
//         }

//         return true; // Allow all other routes
//       },
//     },
//     pages: {
//       signIn: "/home", // Redirect to home if unauthorized
//     },
//   }
// );

// export const config = {
//   matcher: [
//     "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
//   ],
// };
//===============================================================================
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  const protectedRoutes = ["/profile", "/settings", "/orders"];
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected) {
    // Use NextAuth's getToken instead of checking cookies directly
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      const response = NextResponse.redirect(new URL("/home", request.url));
      response.cookies.set("auth-required", "true", { maxAge: 60 });
      return response;
    }
  }
  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);
  return response;
}
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
