"use client";

import { Users, BookOpen, Layers, Activity, MoreHorizontal, ChevronRight } from "lucide-react";
import { trpc } from "@/trpc/client";
import Image from "next/image";

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = trpc.admin.getStats.useQuery();

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center h-64 text-primary-600">
        Chargement des données...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-10">
      
      {/* En-tête */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-primary-950 dark:text-white tracking-tight">Vue d'ensemble</h2>
          <p className="text-neutral-500 mt-1">Gérez les statistiques et les dernières activités de MemoRise.</p>
        </div>
      </div>

      {/* Grille des 4 cartes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Carte 1 : Style Noire avec Courbe (Vert très foncé pour MemoRise) */}
        <div className="bg-[#0A1E1E] rounded-3xl p-6 text-white relative overflow-hidden flex flex-col justify-between h-40 shadow-lg">
          <div className="relative z-10">
            <p className="text-sm font-medium text-white/60 mb-1">Mémoires publiés</p>
            <p className="text-4xl font-black">{stats?.totalMemoires || 0}</p>
          </div>
          
          {/* Graphique décoratif SVG */}
          <div className="absolute bottom-0 right-0 w-2/3 h-2/3 opacity-80 pointer-events-none">
            <svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="none">
              <path d="M0 40 Q 20 40, 30 25 T 60 30 T 80 10 T 100 20 L 100 50 L 0 50 Z" fill="url(#gradient)" opacity="0.2"/>
              <path d="M0 40 Q 20 40, 30 25 T 60 30 T 80 10 T 100 20" fill="none" stroke="#C6F432" strokeWidth="2"/>
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C6F432" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Carte 2 : Utilisateurs */}
        <div className="bg-[#F4F5F7] dark:bg-primary-900 rounded-3xl p-6 flex flex-col justify-between h-40 shadow-sm border border-transparent dark:border-neutral-800">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-neutral-500">Utilisateurs inscrits</p>
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div>
            <p className="text-4xl font-black text-primary-950 dark:text-white mb-1">{stats?.totalUsers || 0}</p>
            <p className="text-xs font-medium text-green-600 flex items-center gap-1">
              <span className="text-green-500">↗</span> +12% ce mois-ci
            </p>
          </div>
        </div>

        {/* Carte 3 : Filières */}
        <div className="bg-[#F4F5F7] dark:bg-primary-900 rounded-3xl p-6 flex flex-col justify-between h-40 shadow-sm border border-transparent dark:border-neutral-800">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-neutral-500">Filières actives</p>
            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div>
            <p className="text-4xl font-black text-primary-950 dark:text-white mb-1">16</p>
            <p className="text-xs font-medium text-neutral-400">Toutes configurées</p>
          </div>
        </div>

        {/* Carte 4 : Signalements */}
        <div className="bg-[#F4F5F7] dark:bg-primary-900 rounded-3xl p-6 flex flex-col justify-between h-40 shadow-sm border border-transparent dark:border-neutral-800">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-neutral-500">Signalements</p>
            <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <Activity className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <div>
            <p className="text-4xl font-black text-primary-950 dark:text-white mb-1">0</p>
            <p className="text-xs font-medium text-green-600 flex items-center gap-1">
              <span className="text-green-500">✓</span> Aucun problème
            </p>
          </div>
        </div>

      </div>

      {/* Section Liste / Tableau */}
      <div className="pt-4">
        
        {/* En-tête de section avec "Onglets" */}
        <div className="flex items-center gap-4 mb-6">
          <h3 className="text-xl font-bold text-primary-950 dark:text-white mr-4">Publications</h3>
          <button className="bg-[#0A1E1E] text-white text-xs font-semibold px-4 py-2 rounded-full">Plus récentes</button>
          <button className="text-neutral-500 hover:text-primary-900 text-xs font-semibold px-4 py-2 rounded-full transition-colors">Plus anciennes</button>
        </div>

        {/* Liste des publications */}
        <div className="space-y-3">
          {stats?.recentMemoires.length === 0 ? (
            <p className="text-neutral-500 text-sm">Aucune publication pour le moment.</p>
          ) : (
            stats?.recentMemoires.map((m) => (
              <div 
                key={m.id} 
                className="group flex items-center justify-between bg-[#F4F5F7] dark:bg-primary-900 hover:bg-[#EAECEF] dark:hover:bg-primary-800 transition-colors rounded-full px-4 py-3 sm:px-6"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0 hidden sm:block" />
                  
                  {/* Avatar simulé (ou initiales) */}
                  <div className="w-10 h-10 rounded-full bg-primary-200 dark:bg-primary-800 flex items-center justify-center shrink-0 border-2 border-white dark:border-primary-700">
                    <span className="text-primary-800 dark:text-primary-200 font-bold text-sm">
                      {m.authorName?.charAt(0) || "A"}
                    </span>
                  </div>

                  {/* Titre et Auteur */}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-primary-950 dark:text-white text-sm truncate pr-4">{m.title}</p>
                    <p className="text-xs text-neutral-500 truncate">Par {m.authorName || "Auteur inconnu"}</p>
                  </div>
                </div>

                {/* Badge Filière et Action */}
                <div className="flex items-center gap-4 shrink-0">
                  <span className="hidden md:inline-block text-[11px] font-bold text-primary-700 bg-white dark:bg-primary-950 px-3 py-1.5 rounded-full shadow-sm">
                    {m.filiereName || "Non définie"}
                  </span>
                  <button className="text-neutral-400 hover:text-primary-900 dark:hover:text-white transition-colors p-2">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}