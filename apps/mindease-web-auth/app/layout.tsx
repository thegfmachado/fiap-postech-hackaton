import type { Metadata } from "next";
import "@mindease/design-system/globals.css";
import { Toaster } from "@mindease/design-system/components";

export const metadata: Metadata = {
  title: "MindEase Auth",
  description: "Authentication for MindEase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        <Toaster closeButton richColors />
      </body>
    </html>
  );
}
