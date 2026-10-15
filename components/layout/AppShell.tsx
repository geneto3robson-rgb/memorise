"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Search, Plus, Bookmark, FileText, Settings,
  Bell, ChevronDown, User,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const navLinks = [
  { href: "/tableau-de-bord", label: "Tableau de bord", short: "Accueil", icon: LayoutDashboard },
  { href: "/explorer", label: "Explorer", short: "Explorer", icon: Search },
  { href: "/publier", label: "Publier", short: "Publier", icon: Plus },
  { href: "/favoris", label: "Enregistrements", short: "Favoris", icon: Bookmark },
  { href: "/publications", label: "Publications", short: "Publi.", icon: FileText },
];

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-60 flex-col bg-primary-500 dark:bg-primary-950 border-r border-white/10 p-4 z-40">
        <Link href="/" className="flex items-center gap-2 px-2 py-3 mb-6">
          <Image src="/logo.svg" alt="MemoRise" width={32} height={32} unoptimized />
          <span className="text-lg font-bold text-white font-heading">MemoRise</span>
        </Link>

        <nav className="flex-1 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActivePath(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-cta-500 text-primary-900"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/parametres"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mt-4 border-t border-white/10 pt-4 transition-colors ${
            isActivePath(pathname, "/parametres")
              ? "bg-cta-500 text-primary-900"
              : "text-white/80 hover:bg-white/10 hover:text-white"
          }`}
        >
          <Settings className="w-4 h-4 shrink-0" />
          Paramètres
        </Link>
      </aside>

      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-primary-500 dark:bg-primary-950 border-t border-white/10 flex justify-around py-2">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const active = isActivePath(pathname, link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-medium ${
                active ? "text-cta-500" : "text-white/70"
              }`}
            >
              <Icon className="w-5 h-5" />
              {link.short}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export function AppHeader() {
  const [open, setOpen] = useState(false);
  const { data: session } = authClient.useSession();
  const userName = session?.user?.name ?? "Mon compte";

  return (
    <header className="sticky top-0 z-30 bg-neutral-50/80 dark:bg-primary-950/80 backdrop-blur border-b border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center justify-end gap-3 px-4 md:px-8 py-3">
        <button
          aria-label="Notifications"
          className="relative p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-primary-900 transition-colors text-primary-900 dark:text-white"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cta-500" />
        </button>

        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-neutral-200 dark:hover:bg-primary-900 transition-colors"
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0">
              <Image src="/images/authors/authors1.jpg" alt="Profil" fill sizes="32px" className="object-cover" />
            </div>
            <span className="hidden sm:block text-sm font-medium text-primary-900 dark:text-white">
              {userName}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-neutral-500 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>

          {open && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-primary-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-xl overflow-hidden z-50">
                <Link
                  href="/parametres"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-primary-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-primary-800"
                >
                  <User className="w-4 h-4" />
                  Mon profil
                </Link>
                <button
                  onClick={() => {
                    authClient.signOut().then(() => {
                      window.location.href = "/";
                    });
                  }}
                  className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm text-error-500 hover:bg-error-50 dark:hover:bg-error-900/20 border-t border-neutral-100 dark:border-neutral-800"
                >
                  Se déconnecter
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}