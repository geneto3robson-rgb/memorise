"use client";

import { useState } from "react";
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

  if (isLoading) return <div className="p-8 text-[#184F53] dark:text-[#CEEC22]">Chargement...</div>;

  const formattedDate = new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto relative pb-10">
      
      {/* MODAL DE SUPPRESSION */}
      {memoireToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1E1E]/40 dark:bg-black/60 backdrop-blur-md">
          <div className="bg-white dark:bg-[#0A1E1E] rounded-[2rem] p-6 md:p-8 max-w-md w-full shadow-2xl border border-neutral-200 dark:border-neutral-800 animate-in zoom-in-95">
            <h3 className="text-xl font-bold text-center text-[#0A1E1E] dark:text-white mb-2">Supprimer ?</h3>
            <p className="text-sm text-center text-neutral-500 mb-6">Supprimer définitivement "{memoireToDelete.title}" ?</p>
            <div className="flex gap-3">
              <button onClick={() => setMemoireToDelete(null)} className="flex-1 px-4 py-3 rounded-full border-2 border-neutral-200 text-neutral-600 font-bold hover:bg-neutral-50">Annuler</button>
              <button onClick={() => deleteMutation.mutate({ id: memoireToDelete.id })} disabled={deleteMutation.isPending} className="flex-1 px-4 py-3 rounded-full bg-red-500 text-white font-bold hover:bg-red-600">Supprimer</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end pt-2 pb-2">
        <p className="text-sm font-medium text-neutral-400 capitalize">{formattedDate}</p>
      </div>

      {/* CARTES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#0A1E1E] rounded-[2rem] p-6 text-white relative overflow-hidden flex flex-col justify-between h-44 shadow-lg hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 cursor-pointer">
          <div className="relative z-10">
            <p className="text-sm font-medium text-white/60 mb-1">Mémoires publiés</p>
            <p className="text-4xl font-black">{stats?.totalMemoires || 0}</p>
            <p className="text-xs font-medium text-[#CEEC22] mt-1 flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" /> +3% ce mois-ci</p>
          </div>
          <div className="absolute bottom-0 right-0 w-3/4 h-2/3 opacity-90 pointer-events-none">
            <svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="none"><path d="M0 40 C 20 40, 30 15, 50 25 C 70 35, 80 5, 100 15" fill="none" stroke="#C6F432" strokeWidth="2.5" strokeLinecap="round"/></svg>
          </div>
        </div>

        <div className="bg-[#F4F5F7] dark:bg-[#0A1E1E] rounded-[2rem] p-6 flex flex-col justify-between h-44 shadow-sm border border-transparent dark:border-neutral-800 hover:scale-[1.02] hover:shadow-lg transition-all duration-300 cursor-pointer">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-neutral-500">Utilisateurs inscrits</p>
            <div className="w-9 h-9 rounded-full bg-primary-50 dark:bg-[#184F53] flex items-center justify-center border border-primary-100 dark:border-[#184F53]"><Users className="w-4 h-4 text-[#184F53] dark:text-[#CEEC22]" /></div>
          </div>
          <div>
            <p className="text-4xl font-black text-[#0A1E1E] dark:text-white mb-1">{stats?.totalUsers || 0}</p>
            <p className="text-xs font-medium text-green-600 flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" /> +12% ce mois-ci</p>
          </div>
        </div>

        <div className="bg-[#F4F5F7] dark:bg-[#0A1E1E] rounded-[2rem] p-6 flex flex-col justify-between h-44 shadow-sm border border-transparent dark:border-neutral-800 hover:scale-[1.02] hover:shadow-lg transition-all duration-300 cursor-pointer">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-neutral-500">Filières actives</p>
            <div className="w-9 h-9 rounded-full bg-neutral-200/50 dark:bg-neutral-800 flex items-center justify-center"><Layers className="w-4 h-4 text-neutral-600 dark:text-neutral-400" /></div>
          </div>
          <div>
            {/* 👇 MODIFICATION ICI : Utilisation de totalFilieres */}
            <p className="text-4xl font-black text-[#0A1E1E] dark:text-white mb-1">{stats?.totalFilieres || 0}</p>
            <p className="text-xs font-medium text-neutral-400">Toutes configurées</p>
          </div>
        </div>

        <div className="bg-[#F4F5F7] dark:bg-[#0A1E1E] rounded-[2rem] p-6 flex flex-col justify-between h-44 shadow-sm border border-transparent dark:border-neutral-800 hover:scale-[1.02] hover:shadow-lg transition-all duration-300 cursor-pointer">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-neutral-500">Croissance (30j)</p>
            <div className="w-9 h-9 rounded-full bg-success-50 dark:bg-success-950 flex items-center justify-center"><TrendingUp className="w-4 h-4 text-success-600 dark:text-success-400" /></div>
          </div>
          <div>
            <p className="text-4xl font-black text-[#0A1E1E] dark:text-white mb-1">+24%</p>
            <p className="text-xs font-medium text-success-600 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Excellente dynamique</p>
          </div>
        </div>
      </div>

      {/* LISTE PUBLICATIONS */}
      <div className="pt-4">
        <div className="flex items-center gap-4 mb-6">
          <h3 className="text-xl font-bold text-[#0A1E1E] dark:text-white mr-2">Publications récentes</h3>
        </div>

        <div className="space-y-3">
          {stats?.recentMemoires.map((m) => (
            <div key={m.id} className="group flex items-center justify-between bg-[#F4F5F7] dark:bg-[#0A1E1E] hover:bg-white dark:hover:bg-[#184F53] transition-all duration-200 rounded-full px-4 py-3 sm:px-6 border border-transparent hover:border-[#184F53]/20 dark:hover:border-[#CEEC22]/30 hover:shadow-md">
              
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0 hidden sm:block" />
                <div className="w-10 h-10 rounded-full bg-primary-200 dark:bg-[#184F53]/20 flex items-center justify-center shrink-0 border-2 border-white dark:border-[#0A1E1E]">
                  <span className="text-[#184F53] dark:text-[#CEEC22] font-bold text-sm">{m.authorName?.charAt(0) || "A"}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[#0A1E1E] dark:text-white text-sm truncate pr-4 group-hover:text-[#184F53] dark:group-hover:text-white transition-colors">{m.title}</p>
                  <p className="text-xs text-neutral-500 dark:text-white/70 truncate">Par {m.authorName || "Auteur inconnu"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className="hidden md:inline-block text-[11px] font-extrabold text-[#0A1E1E] bg-[#CEEC22] px-3 py-1.5 rounded-full shadow-sm">{m.filiereName || "Non définie"}</span>
                
                <div className="relative group/menu">
                  <button className="p-2 text-neutral-400 dark:text-white/50 hover:bg-neutral-200 dark:hover:bg-black/20 rounded-full transition-colors"><MoreHorizontal className="w-5 h-5" /></button>
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-[#0A1E1E] rounded-xl shadow-xl border border-neutral-100 dark:border-neutral-800 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-200 z-20 overflow-hidden">
                    <button onClick={() => setSelectedSlug(m.slug)} className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-[#F4F5F7] dark:hover:bg-[#184F53] text-left transition-colors">
                      <Eye className="w-4 h-4" /> Voir le détail
                    </button>
                    <div className="h-px bg-neutral-100 dark:bg-neutral-800 my-1" />
                    <button onClick={() => setMemoireToDelete({ id: m.id, title: m.title })} className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-left transition-colors">
                      <Trash2 className="w-4 h-4" /> Supprimer
                    </button>
                  </div>
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