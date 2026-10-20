"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Moon, Sun, User } from "lucide-react";
import { useTheme } from "@/lib/theme-context"; // Adapte selon ton context
import { authClient } from "@/lib/auth-client";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggle } = useTheme(); // Si tu as un ThemeProvider
  const { data: session } = authClient.useSession();

  const links = [
    { href: "/explorer", label: "Explorer" },
    { href: "/a-propos", label: "À propos" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#0A1E1E] border-b border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 z-50">
          <Image src="/logo.svg" alt="MemoRise" width={32} height={32} />
          <span className="text-lg font-bold font-heading">MemoRise</span>
        </Link>

        {/* Liens Desktop */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {links.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`hover:text-[#CEEC22] transition-colors ${pathname === link.href ? "text-[#CEEC22]" : "text-white/80"}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <button onClick={toggle} className="p-2 rounded-full hover:bg-white/10 transition-colors">
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          {session ? (
            <Link href="/tableau-de-bord" className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm font-bold">
              <User className="w-4 h-4" /> Mon espace
            </Link>
          ) : (
            <>
              <Link href="/connexion" className="p-2 rounded-full hover:bg-white/10 transition-colors">
                <User className="w-5 h-5" />
              </Link>
              <Link href="/connexion?mode=signup" className="px-5 py-2 rounded-full bg-[#CEEC22] text-[#0A1E1E] text-sm font-bold hover:bg-[#b5d11b] transition-colors">
                S'inscrire
              </Link>
            </>
          )}
        </div>

        {/* Bouton Menu Mobile */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden p-2 z-50 relative"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Menu Mobile Déroulant */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#0A1E1E] border-b border-white/10 flex flex-col p-4 space-y-4 shadow-xl">
          {links.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`text-lg font-medium p-2 rounded-lg ${pathname === link.href ? "bg-white/10 text-[#CEEC22]" : "text-white/80"}`}
            >
              {link.label}
            </Link>
          ))}
          <div className="h-px bg-white/10 my-2" />
          <div className="flex items-center justify-between p-2">
            <span className="text-sm text-white/70">Thème</span>
            <button onClick={toggle} className="p-2 rounded-full bg-white/10">
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
          {session ? (
            <Link href="/tableau-de-bord" onClick={() => setIsOpen(false)} className="flex justify-center items-center gap-2 px-4 py-3 rounded-xl bg-white/10 text-sm font-bold">
              <User className="w-4 h-4" /> Mon espace
            </Link>
          ) : (
            <div className="flex flex-col gap-2">
              <Link href="/connexion" onClick={() => setIsOpen(false)} className="text-center px-4 py-3 rounded-xl border border-white/20 text-sm font-bold">
                Se connecter
              </Link>
              <Link href="/connexion?mode=signup" onClick={() => setIsOpen(false)} className="text-center px-4 py-3 rounded-xl bg-[#CEEC22] text-[#0A1E1E] text-sm font-bold">
                S'inscrire
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}