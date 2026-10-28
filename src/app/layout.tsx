import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Resepify — Perpustakaan Resep Masakan Pilihan & Kreasi Kuliner",
  description:
    "Koleksi resep masakan teruji, rapi, dan terstruktur. Akses eksklusif untuk anggota terdaftar dengan instruksi memasak interaktif.",
  keywords: ["resep masakan", "kuliner nusantara", "resep indonesia", "resep praktis", "cooking catalog"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${playfair.variable} ${plusJakarta.variable}`}>
      <body className="font-sans antialiased selection:bg-terracotta-200 selection:text-terracotta-900 flex flex-col min-h-screen">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
