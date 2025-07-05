import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Resep Cihuy",
  description: "Temukan berbagai resep lezat dari seluruh dunia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Mengubah warna latar belakang seluruh halaman menjadi #FCEF91 */}
      <body className={`${inter.className}`}>{children}</body>
    </html>
  );
}
