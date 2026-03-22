import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";

  // Only protect dev and staging
  if (!host.startsWith("dev.") && !host.startsWith("staging.")) {
    return NextResponse.next();
  }

  const auth = req.headers.get("authorization");

  // Expected credentials
  const username = process.env.BASIC_USER;
  const password = process.env.BASIC_PASS;

  // If no auth or wrong auth → ask again
  if (!auth || auth !== "Basic " + btoa(`${username}:${password}`)) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Protected"',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
