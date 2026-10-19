import type { Metadata, Viewport } from "next"; //  Ajout de Viewport
import { Sora, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-context";
import { TRPCReactProvider } from "@/trpc/client";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MemoRise — Les mémoires de l'ESPA",
  manifest: "/manifest.json",
  description:
    "Découvrez et explorez les mémoires de fin d'études réalisés à l'École Supérieure Polytechnique d'Antananarivo.",
  // 👇 AJOUT POUR IOS (iPhone)
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MemoRise",
  },
};

// AJOUT DE LA COULEUR DE LA BARRE D'ÉTAT (Android & iOS)
export const viewport: Viewport = {
  themeColor: "#184F53",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${sora.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="antialiased bg-white dark:bg-primary-950 text-neutral-900 dark:text-white">
        <ThemeProvider>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}