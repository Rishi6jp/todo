"use client";

import { SessionProvider } from "next-auth/react";
import "./globals.css";
import type { ReactNode } from "react";

export default function RootLayout({ children }: {children: ReactNode}){
  return(
    <html>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}