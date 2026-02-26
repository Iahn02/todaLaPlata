import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import TRPCProvider from "@/trpc/Provider";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmMono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
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
        <body className={`${dmSans.variable} ${dmMono.variable} antialiased`}>
          <TRPCProvider>{children}</TRPCProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
