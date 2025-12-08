"use client"

import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"

const AuthProvider = ({ children }: { children: ReactNode }) => {
  return (
    <SessionProvider 
      basePath="/api/auth"
      refetchInterval={5 * 60}
      refetchOnWindowFocus={true}
    >
      {children}
    </SessionProvider>
  )
}

export default AuthProvider
