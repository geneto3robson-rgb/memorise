"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, User, ChevronDown } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const explorerLinks = [
  { label: "Tous les travaux", href: "/explorer" },
  { label: "Par filière", href: "/explorer" },
  { label: "Par année", href: "/explorer" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary-900/40 backdrop-blur-lg border-b border-white/10">
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-3 flex items-center justify-between">

        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Logo MemoRise" width={40} height={40} />
          <span className="text-xl font-bold text-white font-heading">
            MemoRise
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <div
            className="relative"
            onMouseEnter={() => setIsExplorerOpen(true)}
            onMouseLeave={() => setIsExplorerOpen(false)}
          >
            <button className="flex items-center gap-1 text-sm font-medium text-white hover:text-cta-400 transition-colors">
              Explorer
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  isExplorerOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isExplorerOpen && (
              <div className="absolute top-full left-0 pt-3 min-w-[220px]">
                <div className="bg-primary-900/70 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl overflow-hidden">
                  {explorerLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-3 text-sm text-white hover:bg-white/10 hover:text-cta-400 transition-colors border-b border-white/5 last:border-b-0"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/a-propos"
            className="text-sm font-medium text-white hover:text-cta-400 transition-colors"
          >
            À propos
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/connexion"
            aria-label="Mon compte"
            className="p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors inline-flex items-center justify-center"
          >
            <User className="w-4 h-4" />
          </Link>
          <Link
            href="/connexion?mode=signup"
            className="inline-flex items-center justify-center bg-cta-500 hover:bg-cta-400 text-primary-900 font-semibold rounded-full px-5 py-2 text-sm transition-colors"
          >
            S&apos;inscrire
          </Link>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-white"
          aria-label="Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      </div>

      {isOpen && (
        <nav className="md:hidden px-4 pb-4 flex flex-col gap-3 border-t border-white/10 bg-primary-900/80 backdrop-blur-lg">
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider text-white/50 pt-2 pb-1">
              Explorer
            </span>
            {explorerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white hover:text-cta-400 py-2 pl-3 border-l-2 border-white/10 hover:border-cta-500 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Link
            href="/a-propos"
            className="text-sm font-medium text-white hover:text-cta-400 py-2"
          >
            À propos
          </Link>
          <Link
            href="/connexion?mode=signup"
            className="inline-flex items-center justify-center bg-cta-500 hover:bg-cta-400 text-primary-900 font-semibold rounded-full py-2 text-sm transition-colors"
          >
            S&apos;inscrire
          </Link>
        </nav>
      )}

    </header>
  );
}