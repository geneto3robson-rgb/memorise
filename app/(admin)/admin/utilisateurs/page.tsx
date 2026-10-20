"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, MoreHorizontal, ShieldCheck, GraduationCap, Eye, Ban, Trash2 } from "lucide-react";
import { trpc } from "@/trpc/client";
import { UserAvatar } from "@/components/ui/UserAvatar";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<"tous" | "etudiant" | "admin">("tous");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const { data: users, isLoading } = trpc.admin.listUsers.useQuery();

  // 👇 CORRECTION DU CLIC EXTÉRIEUR 👇
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!(event.target as Element).closest('.dropdown-menu-wrapper')) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) {
    return <div className="p-8 text-[#184F53] dark:text-[#CEEC22] font-medium">Chargement des utilisateurs...</div>;
  }

  const filteredUsers = users?.filter((u) => {
    const matchesSearch = (u.name?.toLowerCase() || "").includes(search.toLowerCase()) || (u.email?.toLowerCase() || "").includes(search.toLowerCase());
    const matchesRole = filterRole === "tous" || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 md:space-y-8 max-w-[1400px] mx-auto pb-10">
      
      {/* ... (En-tête et barre d'outils inchangés) ... */}

      <div className="space-y-3">
        {!filteredUsers || filteredUsers.length === 0 ? (
          <p className="text-neutral-500 text-sm text-center py-10">Aucun utilisateur trouvé.</p>
        ) : (
          filteredUsers.map((user) => {
            const isAdmin = user.role === "admin";
            
            return (
              <div key={user.id} className="group flex flex-col sm:flex-row sm:items-center justify-between bg-white md:bg-[#F4F5F7] dark:bg-[#0A1E1E] hover:bg-white dark:hover:bg-[#184F53] transition-all duration-200 rounded-2xl md:rounded-full p-4 sm:px-6 border border-neutral-200 md:border-transparent dark:border-neutral-800 hover:border-[#184F53]/20 dark:hover:border-[#CEEC22]/30 hover:shadow-md gap-3 sm:gap-0 relative">
                
                {/* ... (Avatar et infos) ... */}
                <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                  <UserAvatar name={user.name} image={user.image} className={`w-10 h-10 text-sm border-2 ${isAdmin ? "border-[#CEEC22]" : "border-white dark:border-[#0A1E1E]"}`} />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-[#0A1E1E] dark:text-white text-sm truncate pr-4">{user.name || "Nom inconnu"}</p>
                    <p className="text-xs font-medium text-neutral-500 dark:text-white/70 truncate">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 md:gap-4 shrink-0 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-100 dark:border-neutral-800">
                  <span className="hidden md:inline-block text-[11px] font-bold text-[#184F53] dark:text-[#CEEC22]">
                    {user.filiereCode ? `${user.filiereCode} — ${user.filiereName}` : "Non définie"}
                  </span>

                  {isAdmin ? (
                    <span className="inline-flex items-center gap-1.5 text-[10px] md:text-[11px] font-extrabold text-[#0A1E1E] bg-[#CEEC22] px-3 py-1.5 rounded-full shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5" /> Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[10px] md:text-[11px] font-bold text-[#184F53] dark:text-[#CEEC22] bg-white dark:bg-[#184F53]/20 px-3 py-1.5 rounded-full border border-[#184F53]/20 dark:border-[#CEEC22]/30">
                      <GraduationCap className="w-3.5 h-3.5" /> Étudiant
                    </span>
                  )}

                  {/* 👇 MENU 3 POINTS CORRIGÉ 👇 */}
                  <div className="relative dropdown-menu-wrapper">
                    <button 
                      onClick={(e) => { 
                        e.preventDefault();
                        e.stopPropagation(); 
                        setOpenMenuId(openMenuId === user.id ? null : user.id); 
                      }}
                      className="p-2 text-neutral-400 dark:text-white/50 hover:bg-neutral-200 dark:hover:bg-black/20 rounded-full transition-colors"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                    
                    {openMenuId === user.id && (
                      <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-[#0A1E1E] rounded-xl shadow-2xl border border-neutral-100 dark:border-neutral-800 z-50 overflow-hidden animate-in fade-in zoom-in-95">
                        {/* 👇 Lien corrigé pour chercher ses publications 👇 */}
                        <Link 
                          href={`/explorer?q=${encodeURIComponent(user.name || "")}`} 
                          className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-[#F4F5F7] dark:hover:bg-[#184F53] text-left transition-colors"
                        >
                          <Eye className="w-4 h-4" /> Voir les publications
                        </Link>
                        <div className="h-px bg-neutral-100 dark:bg-neutral-800 my-1" />
                        {/* 👇 Bannir remplacé par Supprimer 👇 */}
                        <button onClick={() => alert("Fonctionnalité de suppression à venir")} className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-left transition-colors">
                          <Trash2 className="w-4 h-4" /> Supprimer l'utilisateur
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}