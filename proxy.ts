import { NextResponse, type NextRequest } from "next/server"

const SINGLE_BARBERSHOP_ID = process.env.SINGLE_BARBERSHOP_ID?.trim() || null

export function proxy(request: NextRequest) {
  if (!SINGLE_BARBERSHOP_ID) return NextResponse.next()

  return NextResponse.redirect(new URL("/", request.url))
}

export const config = {
  matcher: ["/barbershops", "/barbershops/:path*"],
}
