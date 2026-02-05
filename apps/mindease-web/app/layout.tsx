import { Providers } from "components/providers";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"

import { Toaster } from "@mindease/design-system/components";

import "../styles/globals.css"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "MindEase",
  description: "Sistema de Produtividade Acessível para Neurodivergentes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <Providers>{children}</Providers>
        <Toaster richColors closeButton />
      </body>
    </html>
  )
}
