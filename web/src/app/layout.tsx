import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import TRPCProvider from "@/trpc/Provider";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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
        <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
          <ThemeProvider>
            <TRPCProvider>{children}</TRPCProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
