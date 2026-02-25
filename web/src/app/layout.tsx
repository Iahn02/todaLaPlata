import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "todaLaPlata — Control de Finanzas Personales",
  description:
    "Registra, analiza y controla tus finanzas personales. Gestiona ingresos, gastos, presupuestos y múltiples cuentas en un solo lugar.",
  keywords: [
    "finanzas personales",
    "control de gastos",
    "presupuesto",
    "ahorro",
    "ingresos",
    "gastos",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="es" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
