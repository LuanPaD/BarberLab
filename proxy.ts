import { NextResponse, type NextRequest } from "next/server"

const SINGLE_BARBERSHOP_ID = process.env.SINGLE_BARBERSHOP_ID?.trim() || null

// Aqui, e não na página: `redirect()` durante o render só emite meta refresh.
export function proxy(request: NextRequest) {
  if (!SINGLE_BARBERSHOP_ID) return NextResponse.next()

  return NextResponse.redirect(new URL("/", request.url))
}

export const config = {
  matcher: ["/barbershops", "/barbershops/:path*"],
}
