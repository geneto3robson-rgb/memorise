import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-context";
import { FavorisProvider } from "@/lib/favoris-context";

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
  description:
    "Découvrez et explorez les mémoires de fin d'études réalisés à l'École Supérieure Polytechnique d'Antananarivo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Le layout racine pour l'application, incluant le ThemeProvider et le FavorisProvider
  return (
    <html lang="fr" className={`${sora.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <FavorisProvider>{children}</FavorisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}