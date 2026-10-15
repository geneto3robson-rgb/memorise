"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { label: "Explorer", href: "/explorer" },
  { label: "Mes favoris", href: "/favoris" },
  { label: "Mes publications", href: "/publications" },
];

export function NavbarApp() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-primary-900 dark:bg-primary-950 border-b border-white/10">
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Logo MemoRise" width={40} height={40} />
          <span className="text-xl font-bold text-white font-heading">MemoRise</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white/10 text-cta-400"
                    : "text-white hover:bg-white/5 hover:text-cta-400"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          <Button className="bg-cta-500 hover:bg-cta-400 text-primary-900 font-semibold rounded-full px-5">
            Publier
          </Button>

          <div className="relative">
            <button
              onClick={() => setIsUserOpen(!isUserOpen)}
              aria-label="Menu utilisateur"
              className="flex items-center gap-1 p-1 pr-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <span className="w-7 h-7 rounded-full bg-cta-500 flex items-center justify-center text-primary-900 font-semibold text-xs">
                JG
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  isUserOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isUserOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-primary-900/95 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl overflow-hidden">
                <Link
                  href="/parametres"
                  onClick={() => setIsUserOpen(false)}
                  className="block px-4 py-3 text-sm text-white hover:bg-white/10 hover:text-cta-400 transition-colors border-b border-white/5"
                >
                  Paramètres
                </Link>
                <button
                  className="w-full text-left px-4 py-3 text-sm text-white/80 hover:bg-white/10 hover:text-cta-400 transition-colors"
                >
                  Se déconnecter
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="md:hidden p-2 text-white"
          aria-label="Menu"
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isMobileOpen && (
        <nav className="md:hidden px-4 pb-4 flex flex-col gap-1 border-t border-white/10 bg-primary-900/95 backdrop-blur-lg">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileOpen(false)}
              className="text-sm font-medium text-white hover:text-cta-400 py-2.5"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/parametres"
            onClick={() => setIsMobileOpen(false)}
            className="text-sm font-medium text-white hover:text-cta-400 py-2.5"
          >
            Paramètres
          </Link>
          <Button className="mt-2 bg-cta-500 hover:bg-cta-400 text-primary-900 font-semibold rounded-full">
            Publier un mémoire
          </Button>
        </nav>
      )}
    </header>
  );
}