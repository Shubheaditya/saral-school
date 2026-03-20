import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import ConditionalLayout from "./components/ConditionalLayout";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Saral School | Learning Made Simple",
  description: "A friendly, gamified learning experience for children at Saral School.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body
        className={`${nunito.variable} antialiased selection:bg-brand-primary selection:text-text-main bg-white text-slate-900`}
      >
        <ConditionalLayout>{children}</ConditionalLayout>
        <Analytics />
      </body>
    </html>
  );
}
