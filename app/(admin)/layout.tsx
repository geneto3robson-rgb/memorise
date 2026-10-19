"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/trpc/client";
import { 
  LayoutDashboard, Users, BookOpen, Settings, LogOut,
  ShieldCheck, GraduationCap, Menu, X, ChevronUp
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
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false); // 👈 NOUVEL ÉTAT

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

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
    return <div className="min-h-screen flex items-center justify-center bg-[#F4F5F7]"><p className="text-[#184F53] font-medium">Vérification...</p></div>;
  }

  return (
    <div className="flex h-screen bg-[#F4F5F7] dark:bg-[#051414] overflow-hidden relative">
      
      <ConfirmModal
        isOpen={isSwitchModalOpen}
        onClose={() => setIsSwitchModalOpen(false)}
        onConfirm={() => router.push("/tableau-de-bord")}
        title="Passer en Mode Étudiant"
        message="Vous allez quitter l'interface d'administration pour accéder à votre espace étudiant. Souhaitez-vous continuer ?"
        confirmText="Oui, basculer"
      />

      {/* Overlay sombre sur mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#184F53] flex flex-col shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
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
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`flex items-center gap-3 px-5 py-3.5 rounded-full transition-all duration-200 ${isActive ? "bg-[#CEEC22] text-[#0A1E1E] shadow-lg font-bold" : "text-white/70 hover:bg-white/10 hover:text-white font-medium"}`}
              >
                <Icon className="w-5 h-5" /> {link.label}
              </Link>
            );
          })}
        </nav>

        {/* MENU PROFIL (Modifié pour être au clic) */}
        <div className="p-4 mt-auto relative">
          
          {/* Menu déroulant (s'affiche au-dessus du profil) */}
          {isProfileMenuOpen && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-[#0A1E1E] rounded-2xl shadow-xl overflow-hidden z-50 border border-white/10">
              <div className="p-2 space-y-1">
                <button onClick={() => { setIsProfileMenuOpen(false); setIsSwitchModalOpen(true); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[#CEEC22] hover:bg-white/10 transition-colors text-left">
                  <GraduationCap className="w-4 h-4" /> Mode Étudiant
                </button>
                <Link href="/admin/parametres" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors">
                  <Settings className="w-4 h-4" /> Paramètres
                </Link>
                <div className="h-px bg-white/10 my-1" />
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors text-left">
                  <LogOut className="w-4 h-4" /> Déconnexion
                </button>
              </div>
            </div>
          )}

          {/* Bouton du profil (ouvre le menu au clic) */}
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
                <p className="text-[10px] text-[#CEEC22] font-bold uppercase tracking-wider flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Admin</p>
              </div>
            </div>
            <ChevronUp className={`w-4 h-4 text-white/50 transition-transform ${isProfileMenuOpen ? "rotate-180" : ""}`} />
          </button>
        </div>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full">
        <header className="lg:hidden bg-white dark:bg-[#0A1E1E] border-b border-neutral-200 dark:border-neutral-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <Image src="/logo.svg" alt="Logo" width={24} height={24} />
             <span className="font-bold text-[#0A1E1E] dark:text-white">Admin</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
            <Menu className="w-5 h-5" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="bg-white dark:bg-[#0A1E1E] rounded-[2rem] shadow-sm min-h-full p-4 md:p-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}