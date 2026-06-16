// src/app/layout.tsx

import "./globals.css";

import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";

import { Layout } from "@/components/layout/Layout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Aureate Executive HRM",
  description: "Enterprise Human Resources Management Suite",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>

      <body
        className={`${inter.variable} ${playfair.variable} font-body-md text-on-surface bg-background`}
      >
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}