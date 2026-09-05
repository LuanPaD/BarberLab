import { NextResponse, type NextRequest } from "next/server"

const SINGLE_BARBERSHOP_ID = process.env.SINGLE_BARBERSHOP_ID?.trim() || null

/**
 * No modo de venda unitária o catálogo não existe. O desvio mora aqui, e não
 * na página, para devolver um 307 de verdade: `redirect()` dentro do componente
 * já começou a transmitir a resposta e só consegue emitir um meta refresh, que
 * buscador nenhum entende como redirecionamento.
 */
export function middleware(request: NextRequest) {
  if (!SINGLE_BARBERSHOP_ID) return NextResponse.next()

  return NextResponse.redirect(new URL("/", request.url))
}

export const config = {
  matcher: ["/barbershops", "/barbershops/:path*"],
}
