"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { ShieldAlert, X } from "lucide-react"; 
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Search, Plus, Bookmark, FileText, Settings,
  Bell, ChevronDown, User, LogOut, CheckCircle
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/trpc/client";
import { Navbar } from "@/components/layout/Navbar"; 
import { Footer } from "@/components/layout/Footer"; 
import { ConfirmModal } from "@/components/ConfirmModal";
import { AppFooter } from "@/components/layout/AppFooter"; 
import { UserAvatar } from "@/components/ui/UserAvatar";

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
      <aside className="hidden lg:flex fixed top-4 bottom-4 left-4 w-64 flex-col bg-[#184F53] border border-white/10 rounded-[2rem] shadow-2xl p-4 z-40">
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
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-colors ${
                  active ? "bg-[#CEEC22] text-[#0A1E1E] shadow-md font-bold" : "text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="mt-auto pt-4">
          <Link
            href="/parametres"
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-colors ${
              isActivePath(pathname, "/parametres") ? "bg-[#CEEC22] text-[#0A1E1E] shadow-md font-bold" : "text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Settings className="w-4 h-4 shrink-0" />
            Paramètres
          </Link>
        </div>
      </aside>
      
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white/90 dark:bg-[#0A1E1E]/90 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 flex justify-around py-2 pb-[env(safe-area-inset-bottom)]">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const active = isActivePath(pathname, link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 px-3 py-1 text-[10px] font-medium transition-colors ${
                active ? "text-[#184F53] dark:text-[#CEEC22]" : "text-neutral-500 dark:text-neutral-400 hover:text-[#184F53]"
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? "fill-[#184F53]/10 dark:fill-[#CEEC22]/10" : ""}`} />
              {link.short}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export function AppHeader({ isAdmin }: { isAdmin: boolean }) {
  const router = useRouter();
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  
  const { data: session } = authClient.useSession();
  const userName = session?.user?.name ?? "Mon compte";

  const utils = trpc.useUtils();
  const { data: notifications = [] } = trpc.notification.list.useQuery(undefined, { enabled: !!session });
  const { data: unreadCount = 0 } = trpc.notification.unreadCount.useQuery(undefined, { enabled: !!session });

  const deleteNotif = trpc.notification.delete.useMutation({ 
    onMutate: async ({ id }) => { /*...*/ }, 
    onSettled: () => { utils.notification.list.invalidate(); utils.notification.unreadCount.invalidate(); } 
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsUserOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setIsNotifOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <ConfirmModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onConfirm={() => router.push("/admin")}
        title="Passer en Mode Administrateur"
        message="Vous allez quitter votre espace étudiant pour accéder au panneau d'administration. Souhaitez-vous continuer ?"
        confirmText="Oui, basculer"
      />

      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#051414]/80 backdrop-blur-lg border-b border-neutral-200/50 dark:border-neutral-800/50">
        <div className="flex items-center justify-end gap-3 px-4 md:px-8 py-3">
          
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => { setIsNotifOpen(!isNotifOpen); setIsUserOpen(false); }}
              aria-label="Notifications" 
              className="relative p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors text-primary-900 dark:text-white"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#0A1E1E]" />}
            </button>
            {isNotifOpen && (
              <div className="absolute top-full right-0 mt-2 w-80 max-w-[calc(100vw-2rem)]">
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden">
                   <div className="p-3 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
                      <p className="text-sm font-semibold text-primary-900 dark:text-white">Notifications</p>
                   </div>
                   <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="p-4 text-center text-sm text-neutral-500">Aucune notification.</p>
                      ) : (
                        notifications.map((n) => (
                          <div key={n.id} className={`group relative flex items-start gap-3 p-4 border-b border-neutral-100 dark:border-white/5 last:border-b-0 transition-colors hover:bg-neutral-50 dark:hover:bg-white/5 ${!n.isRead ? "bg-cta-50/50 dark:bg-primary-900/30" : ""}`}>
                            <CheckCircle className={`w-4 h-4 shrink-0 mt-0.5 ${!n.isRead ? "text-cta-500" : "text-neutral-300"}`} />
                            <Link href={n.link || "#"} className="flex-1 pr-6">
                              <p className={`text-sm ${!n.isRead ? "font-medium" : "text-neutral-600 dark:text-neutral-400"}`}>{n.message}</p>
                            </Link>
                            <button 
                              onClick={(e) => { e.preventDefault(); deleteNotif.mutate({ id: n.id }); }} 
                              className="absolute right-3 top-3 p-1 text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                            >
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

          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => { setIsUserOpen(!isUserOpen); setIsNotifOpen(false); }}
              className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-neutral-200 dark:hover:border-neutral-800"
            >
              <UserAvatar name={session?.user?.name} image={session?.user?.image} className="w-8 h-8 text-xs" />
              <span className="hidden sm:block text-sm font-medium text-primary-900 dark:text-white">{userName.split(" ")[0]}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-neutral-500 transition-transform duration-200 ${isUserOpen ? "rotate-180" : ""}`} />
            </button>

            {isUserOpen && (
              <div className="absolute top-full right-0 mt-2 w-56">
                <div className="bg-white dark:bg-[#0A1E1E] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl overflow-hidden">
                  
                  {isAdmin && (
                    <button 
                      onClick={() => { setIsUserOpen(false); setIsAdminModalOpen(true); }} 
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-[#0A1E1E] bg-[#CEEC22] hover:bg-[#b5d11b] transition-colors text-left"
                    >
                      <ShieldAlert className="w-4 h-4" /> Mode Admin
                    </button>
                  )}

                  <Link href="/parametres" onClick={() => setIsUserOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-primary-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors">
                    <User className="w-4 h-4" /> Mon profil
                  </Link>
                  <div className="h-px bg-neutral-100 dark:bg-neutral-800" />
                  <button onClick={() => { authClient.signOut().then(() => { window.location.href = "/"; }); }} className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                    <LogOut className="w-4 h-4" /> Se déconnecter
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  
  // 👇 AJOUT DU STALETIME POUR ÉVITER DE RECHARGER LE PROFIL À CHAQUE PAGE 👇
  const { data: profileData } = trpc.profile.get.useQuery(undefined, { 
    enabled: !!session,
    staleTime: 5 * 60 * 1000, // Le profil est gardé en cache pendant 5 minutes
  }); 
  
  const isAdmin = profileData?.profile?.role === "admin"; 

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F5F7] dark:bg-[#051414]">
        <div className="w-8 h-8 rounded-full border-4 border-[#CEEC22] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F4F5F7] dark:bg-[#051414]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer /> 
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F5F7] dark:bg-[#051414] flex flex-col">
      <Sidebar />
      <div className="lg:pl-72 flex flex-col flex-1 pb-16 lg:pb-0">
        <AppHeader isAdmin={isAdmin} />
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
        <div className="px-4 md:px-8 pb-6 hidden lg:block">
          <AppFooter />
        </div>
      </div>
    </div>
  );
}