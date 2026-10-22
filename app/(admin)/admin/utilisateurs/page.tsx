"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, MoreHorizontal, ShieldCheck, GraduationCap, Eye, Trash2, AlertTriangle } from "lucide-react";
import { trpc } from "@/trpc/client";
import { UserAvatar } from "@/components/ui/UserAvatar";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<"tous" | "etudiant" | "admin">("tous");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null);

  const utils = trpc.useUtils();
  const { data: users, isLoading } = trpc.admin.listUsers.useQuery();

  const deleteMutation = trpc.admin.deleteUser.useMutation({
    onSuccess: () => {
      utils.admin.listUsers.invalidate();
      utils.admin.getStats.invalidate();
      setUserToDelete(null);
    },
    onError: (err) => {
      alert("Erreur lors de la suppression : " + err.message);
      setUserToDelete(null);
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

  // 👇 CORRECTION LIGNE 44 👇
  if (isLoading) {
    return <div className="p-8 text-primary-500 dark:text-cta-500 font-medium">Chargement des utilisateurs...</div>;
  }

  const filteredUsers = users?.filter((u) => {
    const matchesSearch = (u.name?.toLowerCase() || "").includes(search.toLowerCase()) || (u.email?.toLowerCase() || "").includes(search.toLowerCase());
    const matchesRole = filterRole === "tous" || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    // 👇 CORRECTION LIGNE 54 (max-w-[1400px] -> max-w-350) 👇
    <div className="space-y-6 md:space-y-8 max-w-350 mx-auto pb-10 relative">
      
      {/* MODALE DE SUPPRESSION */}
      {userToDelete && (
        // 👇 CORRECTION LIGNE 58 (z-[100] -> z-100) 👇
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-primary-950/40 dark:bg-black/60 backdrop-blur-md">
          <div className="bg-white dark:bg-primary-950 rounded-[2rem] p-6 md:p-8 max-w-md w-full shadow-2xl border border-neutral-200 dark:border-neutral-800 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4 md:mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-center text-primary-900 dark:text-white mb-2">Supprimer cet utilisateur ?</h3>
            <p className="text-xs md:text-sm text-center text-neutral-500 dark:text-neutral-400 mb-6">
              Êtes-vous sûr de vouloir supprimer définitivement <span className="font-bold text-primary-900 dark:text-white">"{userToDelete.name}"</span> ? Toutes ses publications seront également supprimées.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setUserToDelete(null)} className="flex-1 px-4 py-2.5 md:py-3 rounded-full border-2 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 font-bold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-sm md:text-base">Annuler</button>
              <button onClick={() => deleteMutation.mutate({ id: userToDelete.id })} disabled={deleteMutation.isPending} className="flex-1 px-4 py-2.5 md:py-3 rounded-full bg-red-500 text-white font-bold hover:bg-red-600 transition-colors shadow-md disabled:opacity-50 text-sm md:text-base">
                {deleteMutation.isPending ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-primary-900 dark:text-white tracking-tight">Utilisateurs</h2>
        <p className="text-sm md:text-base text-neutral-500 mt-1">Gérez les comptes de la plateforme.</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4">
        <div className="relative w-full sm:max-w-md group">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom ou email..."
            // 👇 CORRECTION LIGNE 89 👇
            className="w-full h-10 md:h-12 pl-10 md:pl-12 pr-4 bg-neutral-50 dark:bg-primary-950 border border-transparent focus:border-primary-500 dark:focus:border-cta-500 rounded-full text-sm text-primary-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 shadow-sm transition-all"
          />
          <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-neutral-400 group-focus-within:text-primary-500 dark:group-focus-within:text-cta-500 transition-colors" />
        </div>

        <div className="flex bg-neutral-50 dark:bg-primary-950 p-1 rounded-full border border-neutral-200 dark:border-neutral-800 w-full sm:w-auto overflow-x-auto">
          {["tous", "etudiant", "admin"].map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role as any)}
              className={`flex-1 sm:flex-none px-3 md:px-5 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-bold transition-all capitalize ${
                filterRole === role ? "bg-primary-500 text-white shadow-md" : "text-neutral-500 hover:text-primary-500 dark:text-neutral-400 dark:hover:bg-white/10"
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
              <div key={user.id} className="group flex flex-col sm:flex-row sm:items-center justify-between bg-white md:bg-neutral-50 dark:bg-primary-950 hover:bg-white dark:hover:bg-primary-800 transition-all duration-200 rounded-2xl md:rounded-full p-4 sm:px-6 border border-neutral-200 md:border-transparent dark:border-neutral-800 hover:border-primary-500/20 dark:hover:border-cta-500/30 hover:shadow-md gap-3 sm:gap-0 relative">
                
                <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                  <UserAvatar name={user.name} image={user.image} className={`w-10 h-10 text-sm border-2 ${isAdmin ? "border-cta-500" : "border-white dark:border-primary-950"}`} />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-primary-900 dark:text-white text-sm truncate pr-4">{user.name || "Nom inconnu"}</p>
                    <p className="text-xs font-medium text-neutral-500 dark:text-white/70 truncate">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 md:gap-4 shrink-0 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-100 dark:border-neutral-800">
                  <span className="hidden md:inline-block text-[11px] font-bold text-primary-500 dark:text-cta-500">
                    {user.filiereCode ? `${user.filiereCode} — ${user.filiereName}` : "Non définie"}
                  </span>

                  {isAdmin ? (
                    <span className="inline-flex items-center gap-1.5 text-[10px] md:text-[11px] font-extrabold text-primary-900 bg-cta-500 px-3 py-1.5 rounded-full shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5" /> Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[10px] md:text-[11px] font-bold text-primary-500 dark:text-cta-500 bg-white dark:bg-primary-500/20 px-3 py-1.5 rounded-full border border-primary-500/20 dark:border-cta-500/30">
                      <GraduationCap className="w-3.5 h-3.5" /> Étudiant
                    </span>
                  )}

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
                      <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-primary-900 rounded-xl shadow-2xl border border-neutral-100 dark:border-neutral-800 z-50 overflow-hidden animate-in fade-in zoom-in-95">
                        <Link 
                          href={`/explorer?q=${encodeURIComponent(user.name || "")}`} 
                          className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-primary-800 text-left transition-colors"
                        >
                          <Eye className="w-4 h-4" /> Voir les publications
                        </Link>
                        <div className="h-px bg-neutral-100 dark:bg-neutral-800 my-1" />
                        <button onClick={() => { setUserToDelete({ id: user.id, name: user.name || "cet utilisateur" }); setOpenMenuId(null); }} className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-left transition-colors">
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