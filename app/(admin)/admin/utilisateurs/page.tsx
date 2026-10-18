"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, MoreHorizontal, ShieldCheck, GraduationCap, Eye, Ban } from "lucide-react";
import { trpc } from "@/trpc/client";
import { filieres } from "@/lib/data/filieres";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<"tous" | "etudiant" | "admin">("tous");

  const { data: users, isLoading } = trpc.admin.listUsers.useQuery();

  if (isLoading) {
    return <div className="p-8 text-[#184F53] dark:text-[#CEEC22] font-medium">Chargement des utilisateurs...</div>;
  }

  const filteredUsers = users?.filter((u) => {
    const matchesSearch = 
      (u.name?.toLowerCase() || "").includes(search.toLowerCase()) || 
      (u.email?.toLowerCase() || "").includes(search.toLowerCase());
    const matchesRole = filterRole === "tous" || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-10">
      
      <div>
        <h2 className="text-3xl font-bold text-[#0A1E1E] dark:text-white tracking-tight">Utilisateurs</h2>
        <p className="text-neutral-500 mt-1">Gérez les comptes des étudiants et des administrateurs de la plateforme.</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md group">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom ou email..."
            className="w-full h-12 pl-12 pr-4 bg-[#F4F5F7] dark:bg-[#0A1E1E] border border-transparent focus:border-[#184F53] dark:focus:border-[#CEEC22] rounded-full text-sm text-[#0A1E1E] dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#184F53]/20 shadow-sm transition-all"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 group-focus-within:text-[#184F53] dark:group-focus-within:text-[#CEEC22] transition-colors" />
        </div>

        <div className="flex bg-[#F4F5F7] dark:bg-[#0A1E1E] p-1 rounded-full border border-neutral-200 dark:border-neutral-800 w-full sm:w-auto">
          {["tous", "etudiant", "admin"].map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role as any)}
              className={`flex-1 sm:flex-none px-5 py-2 rounded-full text-xs font-bold transition-all capitalize ${
                filterRole === role 
                  ? "bg-[#184F53] text-white shadow-md" 
                  : "text-neutral-500 hover:text-[#184F53] dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white"
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
            const userFiliere = filieres.find(f => f.id === user.filiereId);
            const isAdmin = user.role === "admin";
            
            return (
              <div 
                key={user.id} 
                className="group flex items-center justify-between bg-[#F4F5F7] dark:bg-[#0A1E1E] hover:bg-white dark:hover:bg-[#184F53] transition-all duration-200 rounded-[2rem] px-4 py-3 sm:px-6 border border-transparent hover:border-[#184F53]/20 dark:hover:border-[#CEEC22]/30 hover:shadow-md"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className={`relative w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 transition-colors ${
                    isAdmin ? "border-[#CEEC22] group-hover:ring-2 group-hover:ring-[#CEEC22]/50" : "border-white dark:border-[#0A1E1E] group-hover:ring-2 group-hover:ring-[#CEEC22]/30"
                  }`}>
                    <Image src={user.image || "/images/authors/authors1.jpg"} alt={user.name || "Utilisateur"} fill className="object-cover" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-[#0A1E1E] dark:text-white text-sm truncate pr-4 group-hover:text-[#184F53] dark:group-hover:text-white transition-colors">
                      {user.name || "Nom inconnu"}
                    </p>
                    <p className="text-xs font-medium text-neutral-500 dark:text-white/70 truncate">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="hidden md:inline-block text-[11px] font-bold text-[#184F53] dark:text-[#CEEC22]">
                    {userFiliere ? `${userFiliere.code} — ${userFiliere.name}` : "Non définie"}
                  </span>

                  {isAdmin ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#0A1E1E] bg-[#CEEC22] px-3 py-1.5 rounded-full shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5" /> Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#184F53] dark:text-[#CEEC22] bg-white dark:bg-[#184F53]/20 px-3 py-1.5 rounded-full border border-[#184F53]/20 dark:border-[#CEEC22]/30">
                      <GraduationCap className="w-3.5 h-3.5" /> Étudiant
                    </span>
                  )}

                  <div className="relative group/menu">
                    <button className="p-2 text-neutral-400 dark:text-white/50 hover:bg-neutral-200 dark:hover:bg-black/20 rounded-full transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-[#0A1E1E] rounded-xl shadow-xl border border-neutral-100 dark:border-neutral-800 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-200 z-20 overflow-hidden">
                      
                      {/* 👇 CORRECTION DU 404 ICI */}
                      <Link 
                        href="/explorer" 
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-[#F4F5F7] dark:hover:bg-[#184F53] text-left transition-colors"
                      >
                        <Eye className="w-4 h-4" /> Voir les publications
                      </Link>
                      
                      <div className="h-px bg-neutral-100 dark:bg-neutral-800 my-1" />
                      
                      {/* BOUTON BANNIR DÉSACTIVÉ */}
                      <button 
                        disabled
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-neutral-400 dark:text-neutral-600 cursor-not-allowed text-left"
                      >
                        <Ban className="w-4 h-4" /> Bannir (bientôt)
                      </button>
                    </div>
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