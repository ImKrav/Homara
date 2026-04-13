import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Homara — Materiales para el Hogar y Construcción",
  description:
    "Calcula, planifica y compra tus materiales de construcción sin errores. Asistente inteligente de proyectos de remodelación con cálculo automático de materiales.",
  keywords: [
    "materiales de construcción",
    "ferretería",
    "hogar",
    "remodelación",
    "baldosas",
    "herramientas",
    "pintura",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
