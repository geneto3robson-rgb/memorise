"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ShieldAlert } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Search, Plus, Bookmark, FileText, Settings,
  Bell, ChevronDown, User, LogOut, CheckCircle, X
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/trpc/client";
import { Navbar } from "@/components/layout/Navbar"; // 👈 Import de la Navbar publique

const navLinks = [
  { href: "/tableau-de-bord", label: "Tableau de bord", short: "Accueil", icon: LayoutDashboard },
  { href: "/explorer", label: "Explorer", short: "Explorer", icon: Search },
  { href: "/publier", label: "Publier", short: "Publier", icon: Plus },
  { href: "/favoris", label: "Enregistrements", short: "Favoris", icon: Bookmark },
  { href: "/publication", label: "Publications", short: "Publi.", icon: FileText },
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
                  active ? "bg-cta-500 text-primary-900" : "text-white/80 hover:bg-white/10 hover:text-white"
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
            isActivePath(pathname, "/parametres") ? "bg-cta-500 text-primary-900" : "text-white/80 hover:bg-white/10 hover:text-white"
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
              className={`flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-medium ${active ? "text-cta-500" : "text-white/70"}`}
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
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  const { data: session } = authClient.useSession();
  const userName = session?.user?.name ?? "Mon compte";

  const { data: profileData } = trpc.profile.get.useQuery(undefined, { enabled: !!session });
  const isAdmin = profileData?.profile?.role === "admin";

  const utils = trpc.useUtils();
  const { data: notifications = [] } = trpc.notification.list.useQuery(undefined, { enabled: !!session });
  const { data: unreadCount = 0 } = trpc.notification.unreadCount.useQuery(undefined, { enabled: !!session });

  // (Les mutations restent identiques)
  const markRead = trpc.notification.markAsRead.useMutation({ onMutate: async ({ id }) => { /*...*/ }, onSettled: () => { utils.notification.list.invalidate(); utils.notification.unreadCount.invalidate(); } });
  const markAllAsRead = trpc.notification.markAllAsRead.useMutation({ onMutate: async () => { /*...*/ }, onSettled: () => { utils.notification.list.invalidate(); utils.notification.unreadCount.invalidate(); } });
  const deleteNotif = trpc.notification.delete.useMutation({ onMutate: async ({ id }) => { /*...*/ }, onSettled: () => { utils.notification.list.invalidate(); utils.notification.unreadCount.invalidate(); } });

  return (
    <header className="sticky top-0 z-30 bg-neutral-50/80 dark:bg-primary-950/80 backdrop-blur border-b border-neutral-200 dark:border-neutral-800">
      {/* ... Le contenu du header (notifications, profil) reste identique à ton code actuel ... */}
      <div className="flex items-center justify-end gap-3 px-4 md:px-8 py-3">
        <div className="relative" onMouseEnter={() => setIsNotifOpen(true)} onMouseLeave={() => setIsNotifOpen(false)}>
          <button aria-label="Notifications" className="relative p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-primary-900 transition-colors text-primary-900 dark:text-white">
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-success-500 dark:bg-cta-500" />}
          </button>
          {isNotifOpen && (
            <div className="absolute top-full right-0 pt-3 w-80">
              <div className="bg-white dark:bg-primary-900/95 dark:backdrop-blur-lg border border-neutral-200 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden">
                <div className="flex items-center justify-between p-3 border-b border-neutral-100 dark:border-white/5 bg-neutral-50 dark:bg-primary-950/50">
                  <p className="text-sm font-semibold text-primary-900 dark:text-white">Notifications</p>
                  {unreadCount > 0 && (
                    <button onClick={() => markAllAsRead.mutate()} className="text-xs font-medium text-primary-500 hover:text-cta-600 transition-colors">Tout lire</button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-center text-sm text-neutral-500">Aucune notification.</p>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className={`group relative flex items-start gap-3 p-4 border-b border-neutral-100 dark:border-white/5 last:border-b-0 transition-colors hover:bg-neutral-50 dark:hover:bg-white/5 ${!n.isRead ? "bg-cta-50/50 dark:bg-primary-900/30" : ""}`}>
                        <CheckCircle className={`w-4 h-4 shrink-0 mt-0.5 ${!n.isRead ? "text-cta-500" : "text-neutral-300 dark:text-neutral-600"}`} />
                        <Link href={n.link || "#"} onClick={() => markRead.mutate({ id: n.id })} className="flex-1">
                          <p className={`text-sm ${!n.isRead ? "text-primary-900 dark:text-white font-medium" : "text-neutral-600 dark:text-neutral-400"}`}>{n.message}</p>
                          <p className="text-[10px] text-neutral-500 mt-1">{new Date(n.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
                        </Link>
                        <button onClick={(e) => { e.preventDefault(); deleteNotif.mutate({ id: n.id }); }} className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-error-500 transition-all" title="Supprimer">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="relative" onMouseEnter={() => setIsUserOpen(true)} onMouseLeave={() => setIsUserOpen(false)}>
          <button className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-neutral-200 dark:hover:bg-primary-900 transition-colors">
            <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0">
              <Image src={session?.user?.image || "/images/authors/authors1.jpg"} alt="Profil" fill sizes="32px" className="object-cover" />
            </div>
            <span className="hidden sm:block text-sm font-medium text-primary-900 dark:text-white">{userName}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-neutral-500 transition-transform duration-200 ${isUserOpen ? "rotate-180" : ""}`} />
          </button>

          {isUserOpen && (
            <div className="absolute top-full right-0 pt-3 min-w-[220px]">
              <div className="bg-white dark:bg-[#0A1E1E] border border-neutral-200 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden">
                {isAdmin && (
                  <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-[#0A1E1E] bg-[#CEEC22] hover:bg-[#b5d11b] transition-colors border-b border-[#0A1E1E]/10">
                    <ShieldAlert className="w-4 h-4" /> Mode Administrateur
                  </Link>
                )}
                <Link href="/parametres" className="flex items-center gap-3 px-4 py-3 text-sm text-primary-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors border-b border-neutral-100 dark:border-white/5">
                  <User className="w-4 h-4" /> Mon profil
                </Link>
                <button onClick={() => { authClient.signOut().then(() => { window.location.href = "/"; }); }} className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm text-error-500 hover:bg-error-50 dark:hover:bg-white/10 transition-colors">
                  <LogOut className="w-4 h-4" /> Se déconnecter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();

  // 👇 AFFICHAGE PUBLIC (Navbar de la landing page)
  if (!session && !isPending) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#F4F5F7] dark:bg-[#051414]">
          {children}
        </main>
      </>
    );
  }

  // 👇 AFFICHAGE PRIVÉ (Sidebar + Header)
  return (
    <div className="min-h-screen bg-[#F4F5F7] dark:bg-[#051414]">
      <Sidebar />
      <div className="lg:pl-60 flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}