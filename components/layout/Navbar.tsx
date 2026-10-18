"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Menu, X, User, ChevronDown, Bell, LogOut, CheckCircle,
  LayoutDashboard, Bookmark, FileText, Settings,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/trpc/client";

export function Navbar() {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const { data: session, isPending } = authClient.useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const user = session?.user;
  const utils = trpc.useUtils();

  const { data: notifications = [] } = trpc.notification.list.useQuery(undefined, { enabled: !!user });
  const { data: unreadCount = 0 } = trpc.notification.unreadCount.useQuery(undefined, { enabled: !!user });
  
  const markRead = trpc.notification.markAsRead.useMutation({
    onSuccess: () => { utils.notification.list.invalidate(); utils.notification.unreadCount.invalidate(); }
  });
  const markAllAsRead = trpc.notification.markAllAsRead.useMutation({
    onSuccess: () => { utils.notification.list.invalidate(); utils.notification.unreadCount.invalidate(); }
  });
  const deleteNotif = trpc.notification.delete.useMutation({
    onSuccess: () => { utils.notification.list.invalidate(); utils.notification.unreadCount.invalidate(); }
  });

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b border-white/10 ${
        isLanding ? "bg-primary-900/40 backdrop-blur-lg" : "bg-primary-900 dark:bg-primary-950"
      }`}
    >
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Logo MemoRise" width={40} height={40} unoptimized />
          <span className="text-xl font-bold text-white font-heading">MemoRise</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/explorer" className="text-sm font-medium text-white hover:text-cta-400 transition-colors">
            Explorer
          </Link>
          <Link href="/a-propos" className="text-sm font-medium text-white hover:text-cta-400 transition-colors">
            À propos
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {isPending ? (
            <div className="w-24 h-8 rounded-full bg-white/10 animate-pulse" />
          ) : user ? (
            <>
              {/* NOTIFICATIONS */}
              <div className="relative" onMouseEnter={() => setIsNotifOpen(true)} onMouseLeave={() => setIsNotifOpen(false)}>
                <button aria-label="Notifications" className="relative p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors">
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-success-500 dark:bg-cta-500" />}
                </button>

                {isNotifOpen && (
                  <div className="absolute top-full right-0 pt-3 w-80">
                    <div className="bg-primary-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                      <div className="flex items-center justify-between p-3 border-b border-white/10 bg-primary-950/50">
                        <p className="text-sm font-semibold text-white">Notifications</p>
                        {unreadCount > 0 && (
                          <button onClick={() => markAllAsRead.mutate()} className="text-xs font-medium text-cta-400 hover:text-cta-300 transition-colors">
                            Tout lire
                          </button>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="p-4 text-center text-sm text-neutral-400">Aucune notification.</p>
                        ) : (
                          notifications.map((n) => (
                            <div key={n.id} className={`group relative flex items-start gap-3 p-4 border-b border-white/5 last:border-b-0 transition-colors hover:bg-white/5 ${!n.isRead ? "bg-white/5" : ""}`}>
                              <CheckCircle className={`w-4 h-4 shrink-0 mt-0.5 ${!n.isRead ? "text-cta-500" : "text-neutral-500"}`} />
                              <Link href={n.link || "#"} onClick={() => markRead.mutate({ id: n.id })} className="flex-1">
                                <p className={`text-sm ${!n.isRead ? "text-white font-medium" : "text-neutral-400"}`}>{n.message}</p>
                                <p className="text-[10px] text-neutral-500 mt-1">
                                  {new Date(n.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                                </p>
                              </Link>
                              <button onClick={(e) => { e.preventDefault(); deleteNotif.mutate({ id: n.id }); }} className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-error-500 transition-all">
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

              {/* MENU PROFIL */}
              <div className="relative" onMouseEnter={() => setIsUserOpen(true)} onMouseLeave={() => setIsUserOpen(false)}>
                <button className="flex items-center gap-2 p-1 pr-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white">
                  <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0">
                    <Image src={user.image ?? "/images/authors/authors1.jpg"} alt={user.name ?? "Profil"} fill sizes="28px" className="object-cover" />
                  </div>
                  <span className="hidden lg:block text-sm font-medium truncate max-w-[140px]">{user.name}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isUserOpen ? "rotate-180" : ""}`} />
                </button>

                {isUserOpen && (
                  <div className="absolute top-full right-0 pt-3 min-w-[220px]">
                    <div className="bg-primary-900/70 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl overflow-hidden">
                      <Link href="/tableau-de-bord" className="flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-white/10 hover:text-cta-400 transition-colors border-b border-white/5">
                        <LayoutDashboard className="w-4 h-4" /> Tableau de bord
                      </Link>
                      <Link href="/favoris" className="flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-white/10 hover:text-cta-400 transition-colors border-b border-white/5">
                        <Bookmark className="w-4 h-4" /> Enregistrements
                      </Link>
                      <Link href="/publication" className="flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-white/10 hover:text-cta-400 transition-colors border-b border-white/5">
                        <FileText className="w-4 h-4" /> Mes publications
                      </Link>
                      <Link href="/parametres" className="flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-white/10 hover:text-cta-400 transition-colors border-b border-white/5">
                        <Settings className="w-4 h-4" /> Paramètres
                      </Link>
                      <button onClick={() => authClient.signOut().then(() => { window.location.href = "/"; })} className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm text-error-400 hover:bg-white/10 transition-colors">
                        <LogOut className="w-4 h-4" /> Se déconnecter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* RETOUR DES LIENS CLASSIQUES */}
              <Link href="/connexion" aria-label="Mon compte" className="p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors inline-flex items-center justify-center">
                <User className="w-4 h-4" />
              </Link>
              <Link href="/connexion?mode=signup" className="inline-flex items-center justify-center bg-cta-500 hover:bg-cta-400 text-primary-900 font-semibold rounded-full px-5 py-2 text-sm transition-colors">
                S&apos;inscrire
              </Link>
            </>
          )}
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-white" aria-label="Menu">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isOpen && (
        <nav className="md:hidden px-4 pb-4 flex flex-col gap-3 border-t border-white/10 bg-primary-900/95 backdrop-blur-lg">
          <Link href="/explorer" className="text-sm font-medium text-white hover:text-cta-400 py-2">Explorer</Link>
          <Link href="/a-propos" className="text-sm font-medium text-white hover:text-cta-400 py-2">À propos</Link>
          {user ? (
            <>
              <Link href="/parametres" className="text-sm font-medium text-white hover:text-cta-400 py-2">Mon profil</Link>
              <button onClick={() => { authClient.signOut().then(() => { window.location.href = "/"; }); }} className="text-left text-sm font-medium text-error-400 py-2">
                Se déconnecter
              </button>
            </>
          ) : (
            <Link href="/connexion?mode=signup" className="inline-flex items-center justify-center bg-cta-500 hover:bg-cta-400 text-primary-900 font-semibold rounded-full py-2 text-sm transition-colors mt-2">
              S&apos;inscrire
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}