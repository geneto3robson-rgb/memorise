"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/trpc/client";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Settings, 
  LogOut,
  ShieldCheck
} from "lucide-react";

const adminLinks = [
  { href: "/admin", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/admin/utilisateurs", label: "Utilisateurs", icon: Users },
  { href: "/admin/memoires", label: "Mémoires", icon: BookOpen },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  
  const { data: session, isPending } = authClient.useSession(); 
  
  const { data: profileData, isLoading } = trpc.profile.get.useQuery(undefined, {
    enabled: !!session,
  });

  // Sécurité : On vérifie que l'utilisateur est admin
  useEffect(() => {
    if (!isPending && !isLoading) {
      if (!session) {
        router.push("/connexion");
      } else if (profileData?.profile?.role !== "admin") {
        router.push("/tableau-de-bord");
      }
    }
  }, [session, profileData, isPending, isLoading, router]);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  if (isPending || isLoading || profileData?.profile?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F5F7] dark:bg-[#051414]">
        <p className="text-primary-600 font-medium">Vérification des accès administrateur...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F4F5F7] dark:bg-[#051414] p-4 gap-4 overflow-hidden">
      
      {/* 👇 SIDEBAR - Vert Memorise (primary-500) */}
      <aside className="w-64 bg-primary-500 rounded-[2rem] flex flex-col shadow-xl overflow-hidden shrink-0 relative">
        
        {/* Logo */}
        <div className="p-6 flex items-center gap-3">
          <Image src="/logo.svg" alt="Logo MemoRise" width={32} height={32} />
          <h2 className="font-heading font-bold text-xl text-white tracking-wide">MemoRise</h2>
        </div>

        {/* Navigation Principale */}
        <nav className="flex-1 px-4 space-y-2 mt-2">
          {adminLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-cta-500 text-primary-950 shadow-md font-bold"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-primary-950" : ""}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Section Profil avec Menu au survol */}
        <div className="p-4 mt-auto">
          <div className="relative group">
            
            {/* Menu déroulant (apparaît au survol) */}
            <div className="absolute bottom-full left-0 w-full mb-2 bg-primary-900 rounded-2xl shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
              <div className="p-2 space-y-1">
                <Link
                  href="/parametres"
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Paramètres
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Déconnexion
                </button>
              </div>
            </div>

            {/* Profil (Déclencheur du survol) */}
            <div className="flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer border border-transparent group-hover:border-white/10">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 shrink-0">
                <Image src={session?.user?.image || "/images/authors/authors1.jpg"} alt="Admin" fill className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate">{session?.user?.name}</p>
                <p className="text-[10px] text-cta-500 font-bold uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Admin
                </p>
              </div>
              {/* Petit indicateur visuel (chevron) */}
              <div className="text-white/40 group-hover:text-white transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 bg-white dark:bg-primary-950 rounded-[2rem] shadow-sm overflow-hidden flex flex-col">
        <header className="border-b border-neutral-200 dark:border-neutral-800 p-5 flex justify-between items-center bg-white dark:bg-primary-950 z-10">
          <h1 className="font-bold text-lg text-primary-950 dark:text-white">Espace Administrateur</h1>
          <div className="text-sm text-neutral-500">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </div>
      </main>

    </div>
  );
}