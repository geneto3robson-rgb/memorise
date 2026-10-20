"use client";

import { useState, useEffect, useRef } from "react"; // 👈 Ajout de useRef
import Link from "next/link";
import { Search, MoreHorizontal, ShieldCheck, GraduationCap, Eye, Ban } from "lucide-react";
import { trpc } from "@/trpc/client";
import { UserAvatar } from "@/components/ui/UserAvatar";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<"tous" | "etudiant" | "admin">("tous");
  
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null); // 👈 Création de la référence

  const { data: users, isLoading } = trpc.admin.listUsers.useQuery();

  // 👇 CORRECTION : Fermer le menu uniquement si on clique en dehors du menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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
      
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-[#0A1E1E] dark:text-white tracking-tight">Utilisateurs</h2>
        <p className="text-sm md:text-base text-neutral-500 mt-1">Gérez les comptes de la plateforme.</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4">
        <div className="relative w-full sm:max-w-md group">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom ou email..."
            className="w-full h-10 md:h-12 pl-10 md:pl-12 pr-4 bg-[#F4F5F7] dark:bg-[#0A1E1E] border border-transparent focus:border-[#184F53] dark:focus:border-[#CEEC22] rounded-full text-sm text-[#0A1E1E] dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#184F53]/20 shadow-sm transition-all"
          />
          <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-neutral-400 group-focus-within:text-[#184F53] dark:group-focus-within:text-[#CEEC22] transition-colors" />
        </div>

        <div className="flex bg-[#F4F5F7] dark:bg-[#0A1E1E] p-1 rounded-full border border-neutral-200 dark:border-neutral-800 w-full sm:w-auto overflow-x-auto">
          {["tous", "etudiant", "admin"].map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role as any)}
              className={`flex-1 sm:flex-none px-3 md:px-5 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-bold transition-all capitalize ${
                filterRole === role ? "bg-[#184F53] text-white shadow-md" : "text-neutral-500 hover:text-[#184F53] dark:text-neutral-400 dark:hover:bg-white/10"
              }`}
            >
              {role === "etudiant" ? "Étudiants" : role === "admin" ? "Admins" : "Tous"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {!filteredUsers || filteredUsers.length === 0 ? (
          <p className="text-neutral-500 text-sm text-center py-10">Aucun utilisateur trouvé.</p>
        ) : (
          filteredUsers.map((user) => {
            const isAdmin = user.role === "admin";
            
            return (
              <div 
                key={user.id} 
                className="group flex flex-col sm:flex-row sm:items-center justify-between bg-white md:bg-[#F4F5F7] dark:bg-[#0A1E1E] hover:bg-white dark:hover:bg-[#184F53] transition-all duration-200 rounded-2xl md:rounded-full p-4 sm:px-6 border border-neutral-200 md:border-transparent dark:border-neutral-800 hover:border-[#184F53]/20 dark:hover:border-[#CEEC22]/30 hover:shadow-md gap-3 sm:gap-0 relative"
              >
                <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                  <UserAvatar 
                    name={user.name} 
                    image={user.image} 
                    className={`w-10 h-10 text-sm border-2 transition-colors ${
                      isAdmin ? "border-[#CEEC22] group-hover:ring-2 group-hover:ring-[#CEEC22]/50" : "border-white dark:border-[#0A1E1E] group-hover:ring-2 group-hover:ring-[#CEEC22]/30"
                    }`} 
                  />

                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-[#0A1E1E] dark:text-white text-sm truncate pr-4 group-hover:text-[#184F53] dark:group-hover:text-white transition-colors">{user.name || "Nom inconnu"}</p>
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

                  {/* 👇 MENU 3 POINTS AVEC REF 👇 */}
                  <div className="relative">
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setOpenMenuId(openMenuId === user.id ? null : user.id); 
                      }}
                      className="p-2 text-neutral-400 dark:text-white/50 hover:bg-neutral-200 dark:hover:bg-black/20 rounded-full transition-colors"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                    
                    {openMenuId === user.id && (
                      <div 
                        ref={menuRef} // 👈 On attache la référence ici
                        className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#0A1E1E] rounded-xl shadow-2xl border border-neutral-100 dark:border-neutral-800 z-50 overflow-hidden animate-in fade-in zoom-in-95"
                      >
                        <Link href="/explorer" className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-[#F4F5F7] dark:hover:bg-[#184F53] text-left transition-colors">
                          <Eye className="w-4 h-4" /> Voir les publications
                        </Link>
                        <div className="h-px bg-neutral-100 dark:bg-neutral-800 my-1" />
                        <button disabled className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-neutral-400 dark:text-neutral-600 cursor-not-allowed text-left">
                          <Ban className="w-4 h-4" /> Bannir (bientôt)
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