import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "POS Repostería Artesanal",
  description: "Sistema de punto de venta para repostería artesanal",
};

// Layout raíz: envuelve TODA la aplicación.
// Los layouts de (auth) y (dashboard) se anidan dentro de este.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}