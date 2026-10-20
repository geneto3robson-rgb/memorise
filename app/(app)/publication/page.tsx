"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  FileText, Edit, Trash2, AlertTriangle, 
  Plus, ArrowUpRight, Calendar, GraduationCap, MoreHorizontal
} from "lucide-react";
import { trpc } from "@/trpc/client";
import { MemoireModal } from "@/components/memoire/MemoireModal";

export default function MesPublicationsPage() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  // 👇 On stocke bien le slug et le titre dans l'état
  const [memoireToDelete, setMemoireToDelete] = useState<{ slug: string; title: string } | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const utils = trpc.useUtils();
  const { data: memoires, isLoading } = trpc.memoire.mine.useQuery();

  const deleteMutation = trpc.memoire.delete.useMutation({
    onSuccess: () => {
      utils.memoire.mine.invalidate();
      setMemoireToDelete(null);
    },
    onError: (err) => {
      alert("Erreur : " + err.message);
      setMemoireToDelete(null);
    }
  });

  if (isLoading) {
    return (
      <div className="py-20 text-center flex flex-col items-center">
        <div className="w-8 h-8 rounded-full border-4 border-[#184F53] border-t-[#CEEC22] animate-spin mb-4" />
        <p className="text-neutral-500 text-sm">Chargement de vos publications...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pt-6 md:pt-10 pb-24 px-4 md:px-8 relative">
      
      {/* MODAL DE SUPPRESSION */}
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
              
              {/* 👇 CORRECTION ICI : On envoie { slug: memoireToDelete.slug } */}
              <button onClick={() => deleteMutation.mutate({ slug: memoireToDelete.slug })} disabled={deleteMutation.isPending} className="flex-1 px-4 py-2.5 md:py-3 rounded-full bg-red-500 text-white font-bold hover:bg-red-600 transition-colors shadow-md disabled:opacity-50 text-sm md:text-base">
                {deleteMutation.isPending ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="w-16 h-1 bg-[#CEEC22] mb-4 rounded-full" />
          <h1 className="text-2xl md:text-4xl font-bold text-[#0A1E1E] dark:text-white font-heading mb-2">
            Mes publications
          </h1>
          <p className="text-sm md:text-base text-neutral-500">
            {memoires?.length || 0} / 3 publication{(memoires?.length || 0) > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* LISTE DES PUBLICATIONS */}
      {!memoires || memoires.length === 0 ? (
        <div className="rounded-[2rem] border-2 border-dashed border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#0A1E1E] p-10 md:p-16 text-center max-w-2xl mx-auto">
          <div className="w-20 h-20 rounded-full bg-neutral-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-neutral-400" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-[#0A1E1E] dark:text-white mb-3">
            Aucune publication
          </h3>
          <p className="text-sm md:text-base text-neutral-500 mb-8 max-w-md mx-auto">
            Vous n'avez pas encore publié de mémoire. Partagez vos travaux de fin d'études pour les rendre accessibles.
          </p>
          <Link
            href="/publier"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#CEEC22] hover:bg-[#b5d11b] text-[#0A1E1E] text-sm md:text-base font-bold transition-colors shadow-md"
          >
            <Plus className="w-5 h-5" /> Créer ma première publication
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:gap-6">
          {memoires.map((memoire) => (
            <div 
              key={memoire.id} 
              className="group bg-white dark:bg-[#0A1E1E] rounded-[2rem] p-4 md:p-6 shadow-sm border border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row gap-5 md:gap-8 relative overflow-hidden hover:shadow-md transition-all"
            >
              {/* Image de couverture large */}
              <div className="relative w-full md:w-64 h-48 md:h-40 shrink-0 rounded-[1.5rem] overflow-hidden">
                <Image 
                  src={memoire.image || "/images/projects/telecom.jpg"} 
                  alt={memoire.title} 
                  fill 
                  className="object-cover"
                />
                <div className="absolute top-2 left-2">
                  <span className="text-[10px] md:text-xs font-bold text-[#0A1E1E] bg-[#CEEC22] px-3 py-1 rounded-full">
                    {memoire.filiereCode || "Général"}
                  </span>
                </div>
              </div>

              {/* Contenu */}
              <div className="flex-1 flex flex-col min-w-0 py-2">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="font-bold text-[#0A1E1E] dark:text-white text-lg md:text-xl line-clamp-2 leading-tight">
                    {memoire.title}
                  </h3>
                  
                  {/* Menu 3 points (mobile) */}
                  <div className="md:hidden relative">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === memoire.slug ? null : memoire.slug); }}
                      className="p-1.5 text-neutral-400 bg-neutral-100 dark:bg-white/5 rounded-full"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                    {openMenuId === memoire.slug && (
                      <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-[#0A1E1E] rounded-xl shadow-2xl border border-neutral-100 dark:border-neutral-800 z-50 overflow-hidden">
                        <Link href={`/publier?edit=${memoire.slug}`} className="w-full flex items-center gap-2 px-4 py-3 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-[#F4F5F7] dark:hover:bg-white/5">
                          <Edit className="w-3.5 h-3.5" /> Modifier
                        </Link>
                        {/* 👇 CORRECTION ICI : On passe { slug: memoire.slug } */}
                        <button onClick={() => { setMemoireToDelete({ slug: memoire.slug, title: memoire.title }); setOpenMenuId(null); }} className="w-full flex items-center gap-2 px-4 py-3 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                          <Trash2 className="w-3.5 h-3.5" /> Supprimer
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-neutral-500 mb-4">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {memoire.annee}</span>
                  <span className="opacity-50">•</span>
                  <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" /> {memoire.niveau}</span>
                  <span className="opacity-50">•</span>
                  <span className="flex items-center gap-1">Encadreur : {memoire.encadreur}</span>
                </div>

                <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3 mb-6">
                  {memoire.summary}
                </p>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  <button 
                    onClick={() => setSelectedSlug(memoire.slug)}
                    className="text-sm font-bold text-[#184F53] dark:text-[#CEEC22] flex items-center gap-1 hover:underline"
                  >
                    Voir le détail <ArrowUpRight className="w-4 h-4" />
                  </button>

                  {/* Boutons PC */}
                  <div className="hidden md:flex items-center gap-3">
                    <Link href={`/publier?edit=${memoire.slug}`} className="p-2.5 text-neutral-500 hover:text-[#184F53] bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 rounded-full transition-colors" title="Modifier">
                      <Edit className="w-5 h-5" />
                    </Link>
                    {/* 👇 CORRECTION ICI : On passe { slug: memoire.slug } */}
                    <button onClick={() => setMemoireToDelete({ slug: memoire.slug, title: memoire.title })} className="p-2.5 text-neutral-500 hover:text-red-500 bg-neutral-100 dark:bg-white/5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors" title="Supprimer">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <MemoireModal slug={selectedSlug} onClose={() => setSelectedSlug(null)} />
    </div>
  );
}