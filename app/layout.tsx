import type { Metadata, Viewport } from "next";
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

// 👇 MÉTADONNÉES SEO COMPLÈTES 👇
export const metadata: Metadata = {
  title: {
    default: "MemoRise — Les mémoires de l'ESPA",
    template: "%s | MemoRise", // Permet d'avoir "Nom de la page | MemoRise"
  },
  description:
    "Découvrez, recherchez et explorez les mémoires de fin d'études réalisés par les étudiants de l'École Supérieure Polytechnique d'Antananarivo (ESPA).",
  keywords: [
    "ESPA", 
    "mémoire", 
    "Antananarivo", 
    "Madagascar", 
    "recherche académique", 
    "étudiants", 
    "MemoRise",
    "télécommunication",
    "génie"
  ],
  authors: [{ name: "RAVELOTIARAY Jacsilin Geneto Robson" }],
  creator: "MemoRise",
  
  // 👇 AJOUT DU FAVICON (Utilise votre logo.svg existant) 👇
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },

  // 👇 PARTAGE SUR LES RÉSEAUX SOCIAUX (Open Graph) 👇
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://memorise-roan.vercel.app",
    title: "MemoRise — Découvrez les mémoires de l'ESPA",
    description: "Explorez les travaux de fin d'études réalisés à l'ESPA.",
    siteName: "MemoRise",
    images: [
      {
        // Si vous avez une image de présentation, mettez son chemin ici (ex: /images/og-image.jpg)
        // Sinon, on utilise le logo pour l'instant
        url: "/logo.svg", 
        width: 800,
        height: 600,
        alt: "MemoRise Logo",
      },
    ],
  },

  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MemoRise",
  },
};

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