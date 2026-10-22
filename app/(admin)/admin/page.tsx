"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Users, BookOpen, Layers, MoreHorizontal, ChevronRight, 
  Eye, Trash2, TrendingUp, ShieldCheck 
} from "lucide-react";
import { trpc } from "@/trpc/client";
import { MemoireModal } from "@/components/memoire/MemoireModal";

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = trpc.admin.getStats.useQuery();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [memoireToDelete, setMemoireToDelete] = useState<{ id: number; title: string } | null>(null);
  
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const utils = trpc.useUtils();
  const deleteMutation = trpc.admin.deleteMemoire.useMutation({
    onSuccess: () => {
      utils.admin.getStats.invalidate();
      setMemoireToDelete(null);
    },
    onError: (err) => {
      alert("Erreur : " + err.message);
      setMemoireToDelete(null);
    }
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!(event.target as Element).closest('.dropdown-menu-wrapper')) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) return <div className="p-8 text-primary-500 dark:text-cta-500">Chargement...</div>;

  const formattedDate = new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    // 👇 CORRECTION : max-w-[1400px] devient max-w-350 👇
    <div className="space-y-6 md:space-y-8 max-w-350 mx-auto relative pb-10">
      
      {/* MODAL DE SUPPRESSION */}
      {memoireToDelete && (
        // 👇 CORRECTION : z-[100] devient z-100 👇
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-primary-950/40 dark:bg-black/60 backdrop-blur-md">
          <div className="bg-white dark:bg-primary-950 rounded-[2rem] p-6 md:p-8 max-w-md w-full shadow-2xl border border-neutral-200 dark:border-neutral-800 animate-in zoom-in-95">
            <h3 className="text-xl font-bold text-center text-primary-900 dark:text-white mb-2">Supprimer ?</h3>
            <p className="text-sm text-center text-neutral-500 mb-6">Supprimer définitivement "{memoireToDelete.title}" ?</p>
            <div className="flex gap-3">
              <button onClick={() => setMemoireToDelete(null)} className="flex-1 px-4 py-3 rounded-full border-2 border-neutral-200 text-neutral-600 font-bold hover:bg-neutral-50 transition-colors">Annuler</button>
              <button onClick={() => deleteMutation.mutate({ id: memoireToDelete.id })} disabled={deleteMutation.isPending} className="flex-1 px-4 py-3 rounded-full bg-red-500 text-white font-bold hover:bg-red-600 transition-colors">Supprimer</button>
            </div>
          </div>
        </div>
      )}

      <div className="hidden md:flex justify-end pt-2 pb-2">
        <p className="text-sm font-medium text-neutral-400 capitalize">{formattedDate}</p>
      </div>

      {/* CARTES STATISTIQUES */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <div className="bg-primary-950 rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 text-white relative overflow-hidden flex flex-col justify-between h-32 md:h-44 shadow-lg">
          <div className="relative z-10">
            <p className="text-[11px] md:text-sm font-medium text-white/60 mb-1">Mémoires publiés</p>
            <p className="text-2xl md:text-4xl font-black">{stats?.totalMemoires || 0}</p>
            <p className="text-[9px] md:text-xs font-medium text-cta-500 mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +3%</p>
          </div>
          
          <div className="absolute bottom-0 left-0 w-full h-24 md:h-32 opacity-80 pointer-events-none">
            <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#CEEC22" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#CEEC22" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0 35 C 10 35, 20 15, 40 20 C 60 25, 75 10, 100 15 L 100 40 L 0 40 Z" fill="url(#chartGradient)" />
              <path d="M0 35 C 10 35, 20 15, 40 20 C 60 25, 75 10, 100 15" fill="none" stroke="#CEEC22" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <div className="bg-neutral-50 dark:bg-primary-900 rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 flex flex-col justify-between h-32 md:h-44 shadow-sm border border-transparent dark:border-neutral-800">
          <div className="flex justify-between items-start">
            <p className="text-[11px] md:text-sm font-medium text-neutral-500">Utilisateurs</p>
            <div className="w-6 h-6 md:w-9 md:h-9 rounded-full bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center border border-primary-200 dark:border-primary-500/30">
              <Users className="w-3 h-3 md:w-4 md:h-4 text-primary-500 dark:text-cta-500" />
            </div>
          </div>
          <div>
            <p className="text-2xl md:text-4xl font-black text-primary-900 dark:text-white mb-1">{stats?.totalUsers || 0}</p>
            <p className="text-[9px] md:text-xs font-medium text-green-600 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +12%</p>
          </div>
        </div>

        <div className="bg-neutral-50 dark:bg-primary-900 rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 flex flex-col justify-between h-32 md:h-44 shadow-sm border border-transparent dark:border-neutral-800">
          <div className="flex justify-between items-start">
            <p className="text-[11px] md:text-sm font-medium text-neutral-500">Mentions</p>
            <div className="w-6 h-6 md:w-9 md:h-9 rounded-full bg-neutral-200/50 dark:bg-neutral-800 flex items-center justify-center">
              <Layers className="w-3 h-3 md:w-4 md:h-4 text-neutral-600 dark:text-neutral-400" />
            </div>
          </div>
          <div>
            <p className="text-2xl md:text-4xl font-black text-primary-900 dark:text-white mb-1">{stats?.totalFilieres || 0}</p>
            <p className="text-[9px] md:text-xs font-medium text-neutral-400">Configurées</p>
          </div>
        </div>

        <div className="bg-neutral-50 dark:bg-primary-900 rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 flex flex-col justify-between h-32 md:h-44 shadow-sm border border-transparent dark:border-neutral-800">
          <div className="flex justify-between items-start">
            <p className="text-[11px] md:text-sm font-medium text-neutral-500">Croissance</p>
            <div className="w-6 h-6 md:w-9 md:h-9 rounded-full bg-success-50 dark:bg-success-900/20 flex items-center justify-center">
              <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-success-600 dark:text-success-400" />
            </div>
          </div>
          <div>
            <p className="text-2xl md:text-4xl font-black text-primary-900 dark:text-white mb-1">+24%</p>
            <p className="text-[9px] md:text-xs font-medium text-success-600 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Dynamique</p>
          </div>
        </div>
      </div>

      {/* LISTE PUBLICATIONS */}
      <div className="pt-2 md:pt-4">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h3 className="text-lg md:text-xl font-bold text-primary-900 dark:text-white">Publications récentes</h3>
          <Link href="/admin/memoires" className="text-xs md:text-sm font-bold text-primary-500 dark:text-cta-500 hover:underline">
            Voir tout
          </Link>
        </div>

        <div className="space-y-3">
          {stats?.recentMemoires.map((m) => (
            <div key={m.id} className="group flex flex-col sm:flex-row sm:items-center justify-between bg-white md:bg-neutral-50 dark:bg-primary-900 hover:bg-white dark:hover:bg-primary-800 transition-all duration-200 rounded-2xl md:rounded-full p-4 sm:px-6 border border-neutral-200 md:border-transparent dark:border-neutral-800 hover:border-primary-500/20 dark:hover:border-cta-500/30 hover:shadow-md gap-3 sm:gap-0">
              
              <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0 hidden sm:block" />
                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center shrink-0 border-2 border-white dark:border-primary-950">
                  <span className="text-primary-500 dark:text-cta-500 font-bold text-sm">{m.authorName?.charAt(0) || "A"}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-primary-900 dark:text-white text-sm truncate group-hover:text-primary-500 dark:group-hover:text-white transition-colors">{m.title}</p>
                  <p className="text-xs text-neutral-500 dark:text-white/70 truncate">Par {m.authorName || "Auteur inconnu"}</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-100 dark:border-neutral-800">
                <span className="inline-block text-[10px] md:text-[11px] font-extrabold text-primary-900 bg-cta-500 px-3 py-1.5 rounded-full shadow-sm">{m.filiereName || "Non définie"}</span>
                
                <div className="relative dropdown-menu-wrapper">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === m.id ? null : m.id);
                    }}
                    className="p-2 text-neutral-400 dark:text-white/50 hover:bg-neutral-200 dark:hover:bg-black/20 rounded-full transition-colors"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                  
                  {openMenuId === m.id && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-primary-900 rounded-xl shadow-2xl border border-neutral-100 dark:border-neutral-800 z-50 overflow-hidden animate-in fade-in zoom-in-95">
                      <button onClick={() => { setSelectedSlug(m.slug); setOpenMenuId(null); }} className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-primary-800 text-left transition-colors">
                        <Eye className="w-4 h-4" /> Voir le détail
                      </button>
                      <div className="h-px bg-neutral-100 dark:bg-neutral-800 my-1" />
                      <button onClick={() => { setMemoireToDelete({ id: m.id, title: m.title }); setOpenMenuId(null); }} className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-left transition-colors">
                        <Trash2 className="w-4 h-4" /> Supprimer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <MemoireModal slug={selectedSlug} onClose={() => setSelectedSlug(null)} />
    </div>
  );
}