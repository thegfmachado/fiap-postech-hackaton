import type { Metadata } from "next";
import "@mindease/design-system/globals.css";

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
      <body>{children}</body>
    </html>
  );
}
