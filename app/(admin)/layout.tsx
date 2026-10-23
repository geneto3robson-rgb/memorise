"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/trpc/client";
import { 
  LayoutDashboard, Users, BookOpen, LogOut,
  ShieldCheck, GraduationCap, Menu, X, ChevronUp, UserCircle
} from "lucide-react";
import { ConfirmModal } from "@/components/ConfirmModal";

const adminLinks = [
  { href: "/admin", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/admin/utilisateurs", label: "Utilisateurs", icon: Users },
  { href: "/admin/memoires", label: "Mémoires", icon: BookOpen },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession(); 
  const { data: profileData, isLoading } = trpc.profile.get.useQuery(undefined, { enabled: !!session });
  
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isPending && !isLoading) {
      if (!session) router.push("/connexion");
      else if (profileData?.profile?.role !== "admin") router.push("/tableau-de-bord");
    }
  }, [session, profileData, isPending, isLoading, router]);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  if (isPending || isLoading || profileData?.profile?.role !== "admin") {
    return <div className="min-h-screen flex items-center justify-center bg-neutral-50"><p className="text-primary-500 font-medium">Vérification...</p></div>;
  }

  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-primary-950 overflow-hidden relative">
      
      <ConfirmModal
        isOpen={isSwitchModalOpen}
        onClose={() => setIsSwitchModalOpen(false)}
        onConfirm={() => router.push("/tableau-de-bord")}
        title="Passer en Mode Étudiant"
        message="Vous allez quitter l'interface d'administration pour accéder à votre espace étudiant. Souhaitez-vous continuer ?"
        confirmText="Oui, basculer"
      />

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <aside className={`fixed top-4 bottom-4 left-4 z-50 w-64 bg-primary-500 flex flex-col rounded-[2rem] shadow-2xl border border-white/10 transition-transform duration-300 ease-in-out lg:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3 ml-2">
            <Image src="/logo.svg" alt="Logo MemoRise" width={32} height={32} />
            <h2 className="font-heading font-bold text-xl text-white tracking-wide">MemoRise</h2>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-2 text-white/70 hover:text-white bg-white/5 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          {adminLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
            return (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${isActive ? "bg-cta-500 text-primary-900 shadow-md font-bold" : "text-white/60 hover:bg-white/10 hover:text-white font-medium"}`}
              >
                <Icon className="w-5 h-5" /> {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto relative" ref={profileMenuRef}>
          {isProfileMenuOpen && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-primary-950 rounded-2xl shadow-xl overflow-hidden z-50 border border-white/10">
              <div className="p-2 space-y-1">
                <button onClick={() => { setIsProfileMenuOpen(false); setIsSwitchModalOpen(true); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-cta-500 hover:bg-white/10 transition-colors text-left">
                  <GraduationCap className="w-4 h-4" /> Mode Étudiant
                </button>
                
                <Link 
                  href="/admin/parametres" 
                  onClick={() => setIsProfileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    pathname === "/admin/parametres" 
                      ? "bg-white/10 text-white" 
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <UserCircle className="w-4 h-4" /> Profil
                </Link>
                
                <div className="h-px bg-white/10 my-1" />
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors text-left">
                  <LogOut className="w-4 h-4" /> Déconnexion
                </button>
              </div>
            </div>
          )}

          <button 
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="w-full flex items-center justify-between gap-3 px-3 py-3 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer border border-white/10 bg-white/5"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 shrink-0">
                <Image src={session?.user?.image || "/images/authors/authors1.jpg"} alt="Admin" fill className="object-cover" />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="text-sm font-semibold text-white truncate">{session?.user?.name}</p>
                <p className="text-[10px] text-cta-500 font-bold uppercase tracking-wider flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Admin</p>
              </div>
            </div>
            <ChevronUp className={`w-4 h-4 text-white/50 transition-transform ${isProfileMenuOpen ? "rotate-180" : ""}`} />
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-full overflow-hidden w-full lg:pl-72">
        <header className="lg:hidden bg-neutral-50 dark:bg-primary-950 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <Image src="/logo.svg" alt="Logo" width={24} height={24} />
             <span className="font-bold text-primary-900 dark:text-white">Admin</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-neutral-600 dark:text-neutral-400 bg-white dark:bg-primary-900 rounded-xl shadow-sm">
            <Menu className="w-5 h-5" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-0 md:pt-8">
          <div className="bg-white dark:bg-primary-950 rounded-[2rem] shadow-sm min-h-full p-4 md:p-10 border border-neutral-100 dark:border-neutral-800">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}