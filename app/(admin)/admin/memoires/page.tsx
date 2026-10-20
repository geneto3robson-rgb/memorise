"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Search, Trash2, FileText, Calendar, GraduationCap, AlertTriangle, MoreHorizontal, Eye } from "lucide-react";
import { trpc } from "@/trpc/client";
import { MemoireModal } from "@/components/memoire/MemoireModal";

export default function AdminMemoiresPage() {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"recent" | "oldest">("recent");
  const [memoireToDelete, setMemoireToDelete] = useState<{ id: number; title: string } | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const utils = trpc.useUtils();
  const { data: memoires, isLoading } = trpc.admin.listAllMemoires.useQuery();
  
  const deleteMutation = trpc.admin.deleteMemoire.useMutation({
    onSuccess: () => {
      utils.admin.listAllMemoires.invalidate();
      setMemoireToDelete(null);
    },
    onError: (err) => {
      alert("Erreur lors de la suppression : " + err.message);
      setMemoireToDelete(null);
    }
  });

  // Fermer le menu si on clique ailleurs
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredMemoires = useMemo(() => {
    if (!memoires) return [];
    let result = memoires.filter((m) => {
      return (m.title?.toLowerCase() || "").includes(search.toLowerCase()) || 
             (m.authorName?.toLowerCase() || "").includes(search.toLowerCase());
    });
    result.sort((a, b) => {
      if (sortOrder === "recent") return b.id - a.id;
      return a.id - b.id;
    });
    return result;
  }, [memoires, search, sortOrder]);

  if (isLoading) return <div className="p-8 text-[#184F53] dark:text-[#CEEC22] font-medium">Chargement des mémoires...</div>;

  return (
    <div className="space-y-6 md:space-y-8 max-w-[1400px] mx-auto pb-10 relative">
      
      {memoireToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0A1E1E]/40 dark:bg-black/60 backdrop-blur-md">
          <div className="bg-white dark:bg-[#0A1E1E] rounded-[2rem] p-6 md:p-8 max-w-md w-full shadow-2xl border border-neutral-200 dark:border-neutral-800 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4 md:mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-center text-[#0A1E1E] dark:text-white mb-2">Supprimer ce mémoire ?</h3>
            <p className="text-xs md:text-sm text-center text-neutral-500 dark:text-neutral-400 mb-6">
              Êtes-vous sûr de vouloir supprimer définitivement <span className="font-bold text-[#0A1E1E] dark:text-white">"{memoireToDelete.title}"</span> ?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setMemoireToDelete(null)} className="flex-1 px-4 py-2.5 md:py-3 rounded-full border-2 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 font-bold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-sm md:text-base">Annuler</button>
              <button onClick={() => deleteMutation.mutate({ id: memoireToDelete.id })} disabled={deleteMutation.isPending} className="flex-1 px-4 py-2.5 md:py-3 rounded-full bg-red-500 text-white font-bold hover:bg-red-600 transition-colors shadow-md disabled:opacity-50 text-sm md:text-base">
                {deleteMutation.isPending ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-[#0A1E1E] dark:text-white tracking-tight">Mémoires</h2>
        <p className="text-sm md:text-base text-neutral-500 mt-1">Modérez les publications de la plateforme.</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4">
        <div className="relative w-full sm:max-w-md group">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un titre ou un auteur..."
            className="w-full h-10 md:h-12 pl-10 md:pl-12 pr-4 bg-[#F4F5F7] dark:bg-[#0A1E1E] border border-transparent focus:border-[#184F53] dark:focus:border-[#CEEC22] rounded-full text-sm text-[#0A1E1E] dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#184F53]/20 shadow-sm transition-all"
          />
          <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-neutral-400 group-focus-within:text-[#184F53] dark:group-focus-within:text-[#CEEC22] transition-colors" />
        </div>
        
        <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <div className="flex bg-[#F4F5F7] dark:bg-[#0A1E1E] p-1 rounded-full border border-neutral-200 dark:border-neutral-800 shrink-0">
            <button onClick={() => setSortOrder("recent")} className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-bold transition-all ${sortOrder === "recent" ? "bg-[#184F53] text-white shadow-md" : "text-neutral-500 hover:text-[#184F53] dark:text-neutral-400 dark:hover:bg-white/10"}`}>Plus récentes</button>
            <button onClick={() => setSortOrder("oldest")} className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-bold transition-all ${sortOrder === "oldest" ? "bg-[#184F53] text-white shadow-md" : "text-neutral-500 hover:text-[#184F53] dark:text-neutral-400 dark:hover:bg-white/10"}`}>Plus anciennes</button>
          </div>
          <div className="text-[10px] md:text-sm font-bold text-[#184F53] dark:text-[#CEEC22] bg-[#F4F5F7] dark:bg-[#0A1E1E] px-3 md:px-5 py-2 md:py-3 rounded-full border border-transparent shrink-0">
            Total : {memoires?.length || 0}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filteredMemoires.length === 0 ? (
          <p className="text-neutral-500 text-sm text-center py-10">Aucun mémoire trouvé.</p>
        ) : (
          filteredMemoires.map((memoire) => (
            <div 
              key={memoire.id} 
              className="group flex flex-col sm:flex-row sm:items-center justify-between bg-white md:bg-[#F4F5F7] dark:bg-[#0A1E1E] hover:bg-white dark:hover:bg-[#184F53] transition-all duration-200 rounded-2xl md:rounded-full p-4 sm:px-6 border border-neutral-200 md:border-transparent dark:border-neutral-800 hover:border-[#184F53]/20 dark:hover:border-[#CEEC22]/30 hover:shadow-md gap-3 sm:gap-0 relative"
            >
              <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-[#184F53]/20 flex items-center justify-center shrink-0 shadow-sm border border-transparent group-hover:border-[#184F53]/10">
                  <FileText className="w-5 h-5 text-[#184F53] dark:text-[#CEEC22]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-[#0A1E1E] dark:text-white text-sm truncate pr-4 group-hover:text-[#184F53] dark:group-hover:text-white transition-colors">{memoire.title}</p>
                  <p className="text-xs font-medium text-neutral-500 dark:text-white/70 truncate">Par {memoire.authorName || "Auteur inconnu"}</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 md:gap-4 shrink-0 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-100 dark:border-neutral-800">
                <div className="hidden md:flex items-center gap-1.5 text-[11px] font-bold text-[#184F53] dark:text-[#CEEC22]">
                  <Calendar className="w-3.5 h-3.5" /> {memoire.annee}
                  <span className="mx-1 opacity-50">•</span>
                  <GraduationCap className="w-3.5 h-3.5" /> {memoire.niveau}
                </div>

                <span className="inline-block text-[10px] md:text-[11px] font-extrabold text-[#0A1E1E] bg-[#CEEC22] px-3 py-1.5 rounded-full shadow-sm">
                  {memoire.filiereName || "Non définie"}
                </span>

                {/* 👇 MENU 3 POINTS CLIQUABLE CORRIGÉ 👇 */}
                <div className="relative" ref={menuRef}>
                  <button 
                    onClick={(e) => { 
                      e.preventDefault();
                      e.stopPropagation(); 
                      setOpenMenuId(openMenuId === memoire.id ? null : memoire.id); 
                    }}
                    className="p-2 text-neutral-400 dark:text-white/50 hover:bg-neutral-200 dark:hover:bg-black/20 rounded-full transition-colors"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                  
                  {openMenuId === memoire.id && (
                    <div 
                      className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#0A1E1E] rounded-xl shadow-2xl border border-neutral-100 dark:border-neutral-800 z-50 overflow-hidden animate-in fade-in zoom-in-95"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button onClick={() => { setSelectedSlug(memoire.slug); setOpenMenuId(null); }} className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-[#F4F5F7] dark:hover:bg-[#184F53] text-left transition-colors">
                        <Eye className="w-4 h-4" /> Voir le détail
                      </button>
                      <div className="h-px bg-neutral-100 dark:bg-neutral-800 my-1" />
                      <button onClick={() => { setMemoireToDelete({ id: memoire.id, title: memoire.title }); setOpenMenuId(null); }} className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-left transition-colors">
                        <Trash2 className="w-4 h-4" /> Supprimer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <MemoireModal slug={selectedSlug} onClose={() => setSelectedSlug(null)} />
    </div>
  );
}