"use client";

import { useState } from "react";
import Image from "next/image";
import { User, Lock, Bell, Palette, Shield, Upload, Moon, Sun, CheckCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "@/lib/theme-context";
import { filieres } from "@/lib/data/filieres";

export default function ParametresPage() {
  const { data: session, isPending } = authClient.useSession();
  const { theme, toggle } = useTheme();
  
  const [activeTab, setActiveTab] = useState<"profil" | "securite" | "notifications" | "affichage" | "confidentialite">("profil");
  
  // État pour le formulaire
  const [nom, setNom] = useState(session?.user?.name || "");
  const [image, setImage] = useState(session?.user?.image || "");
  const [filiere, setFiliere] = useState("");
  const [parcours, setParcours] = useState("");
  const [statut, setStatut] = useState("Étudiant actuel");

  if (isPending) return <div className="p-10 text-center text-neutral-500">Chargement...</div>;

  const tabs = [
    { id: "profil", label: "Informations", icon: User },
    { id: "securite", label: "Sécurité", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "affichage", label: "Affichage", icon: Palette },
    { id: "confidentialite", label: "Confidentialité", icon: Shield },
  ] as const;

  return (
    <div className="max-w-6xl mx-auto pt-6 md:pt-10 pb-24 px-4 md:px-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#0A1E1E] dark:text-white">Paramètres</h1>
        <p className="text-sm md:text-base text-neutral-500 mt-1">Gérez votre compte et vos préférences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        {/* Onglets gauche (horizontal sur mobile) */}
        <aside className="w-full lg:w-64 shrink-0 bg-white dark:bg-[#0A1E1E] rounded-3xl p-2 md:p-4 shadow-sm border border-neutral-100 dark:border-neutral-800">
          <div className="hidden lg:flex flex-col items-center mb-6 pt-4">
            <div className="relative w-20 h-20 rounded-full overflow-hidden mb-3 border-2 border-[#CEEC22]">
              {image ? <Image src={image} alt="Profil" fill className="object-cover" /> : <div className="w-full h-full bg-[#184F53] text-[#CEEC22] flex items-center justify-center text-2xl font-bold">{nom.charAt(0)}</div>}
            </div>
            <h2 className="text-lg font-bold text-center truncate w-full px-2 text-[#0A1E1E] dark:text-white">{nom}</h2>
            <p className="text-xs text-neutral-500">Étudiant</p>
          </div>

          <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 pb-2 lg:pb-0 scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 md:gap-3 px-4 py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-colors ${
                    isActive ? "bg-[#CEEC22] text-[#0A1E1E] shadow-sm" : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" /> {tab.label}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Contenu principal */}
        <main className="w-full flex-1 bg-white dark:bg-[#0A1E1E] rounded-3xl p-5 md:p-8 shadow-sm border border-neutral-100 dark:border-neutral-800">
          
          {/* 1. INFOS PERSO */}
          {activeTab === "profil" && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-xl font-bold text-[#0A1E1E] dark:text-white mb-4">Informations personnelles</h2>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-[#F4F5F7] dark:bg-white/5 p-4 rounded-2xl">
                <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden shrink-0 border-2 border-white dark:border-neutral-800">
                  {image ? <Image src={image} alt="Profil" fill className="object-cover" /> : <div className="w-full h-full bg-[#184F53] text-[#CEEC22] flex items-center justify-center text-xl font-bold">{nom.charAt(0)}</div>}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="cursor-pointer px-4 py-2 bg-white dark:bg-[#0A1E1E] border border-neutral-200 dark:border-neutral-700 rounded-full text-xs md:text-sm font-bold text-[#184F53] dark:text-[#CEEC22] flex items-center gap-2 shadow-sm hover:bg-neutral-50 w-fit">
                    <Upload className="w-4 h-4" /> Changer la photo
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => { /* logique upload */ }} />
                  </label>
                  <p className="text-[10px] md:text-xs text-neutral-500">JPG, PNG ou GIF. Max 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-xs font-bold text-[#184F53] dark:text-[#CEEC22] mb-2 uppercase">Nom complet</label>
                  <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#F4F5F7] dark:bg-white/5 border border-neutral-200 dark:border-neutral-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#184F53]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#184F53] dark:text-[#CEEC22] mb-2 uppercase">Adresse e-mail</label>
                  <input type="email" readOnly value={session?.user?.email || ""} className="w-full px-4 py-3 rounded-xl bg-[#F4F5F7] dark:bg-white/5 border border-neutral-200 dark:border-neutral-800 text-sm font-medium opacity-60 cursor-not-allowed" />
                </div>
                
                {/* Champs ajoutés */}
                <div>
                  <label className="block text-xs font-bold text-[#184F53] dark:text-[#CEEC22] mb-2 uppercase">Filière</label>
                  <select value={filiere} onChange={(e) => setFiliere(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#F4F5F7] dark:bg-white/5 border border-neutral-200 dark:border-neutral-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#184F53]">
                    <option value="">Sélectionner...</option>
                    {filieres.map(f => <option key={f.id} value={f.code}>{f.code} — {f.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#184F53] dark:text-[#CEEC22] mb-2 uppercase">Parcours</label>
                  <input type="text" value={parcours} onChange={(e) => setParcours(e.target.value)} placeholder="Ex: STI, RS, RC..." className="w-full px-4 py-3 rounded-xl bg-[#F4F5F7] dark:bg-white/5 border border-neutral-200 dark:border-neutral-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#184F53]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#184F53] dark:text-[#CEEC22] mb-2 uppercase">Statut</label>
                  <select value={statut} onChange={(e) => setStatut(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#F4F5F7] dark:bg-white/5 border border-neutral-200 dark:border-neutral-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#184F53]">
                    <option>Étudiant actuel</option>
                    <option>Ancien étudiant</option>
                    <option>Enseignant</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-neutral-100 dark:border-neutral-800 pt-6 mt-6">
                <h3 className="text-sm font-bold text-[#0A1E1E] dark:text-white mb-4">Contacts publics (facultatif)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <input type="text" placeholder="Lien Facebook" className="w-full px-4 py-3 rounded-xl bg-[#F4F5F7] dark:bg-white/5 border border-neutral-200 dark:border-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#184F53]" />
                   <input type="text" placeholder="Lien LinkedIn" className="w-full px-4 py-3 rounded-xl bg-[#F4F5F7] dark:bg-white/5 border border-neutral-200 dark:border-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#184F53]" />
                   <input type="text" placeholder="+261 -- -- --- --" className="w-full px-4 py-3 rounded-xl bg-[#F4F5F7] dark:bg-white/5 border border-neutral-200 dark:border-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#184F53]" />
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
                <button className="px-6 py-3 bg-[#CEEC22] hover:bg-[#b5d11b] text-[#0A1E1E] text-sm font-bold rounded-full transition-colors shadow-sm">Enregistrer les modifications</button>
              </div>
            </div>
          )}

          {/* 2. SÉCURITÉ */}
          {activeTab === "securite" && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-xl font-bold text-[#0A1E1E] dark:text-white mb-4">Sécurité et connexion</h2>
              <div className="bg-[#F4F5F7] dark:bg-white/5 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800">
                <h3 className="font-bold text-sm text-[#0A1E1E] dark:text-white mb-4">Changer le mot de passe</h3>
                <div className="space-y-4 max-w-md">
                  <input type="password" placeholder="Mot de passe actuel" className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#0A1E1E] border border-neutral-200 dark:border-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#184F53]" />
                  <input type="password" placeholder="Nouveau mot de passe" className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#0A1E1E] border border-neutral-200 dark:border-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#184F53]" />
                  <input type="password" placeholder="Confirmer le nouveau mot de passe" className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#0A1E1E] border border-neutral-200 dark:border-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#184F53]" />
                  <button className="px-6 py-2.5 bg-[#184F53] text-white text-sm font-bold rounded-full hover:bg-[#123a3d] transition-colors">Mettre à jour le mot de passe</button>
                </div>
              </div>
            </div>
          )}

          {/* 3. NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-xl font-bold text-[#0A1E1E] dark:text-white mb-4">Préférences de notification</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#F4F5F7] dark:bg-white/5 rounded-2xl border border-neutral-200 dark:border-neutral-800">
                  <div><p className="font-bold text-sm">Nouvelles publications</p><p className="text-xs text-neutral-500">Recevoir un e-mail quand un nouveau mémoire est publié.</p></div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#184F53]" />
                </div>
                <div className="flex items-center justify-between p-4 bg-[#F4F5F7] dark:bg-white/5 rounded-2xl border border-neutral-200 dark:border-neutral-800">
                  <div><p className="font-bold text-sm">Mises à jour de la plateforme</p><p className="text-xs text-neutral-500">Recevoir des informations sur les nouvelles fonctionnalités.</p></div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#184F53]" />
                </div>
              </div>
            </div>
          )}

          {/* 4. AFFICHAGE */}
          {activeTab === "affichage" && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-xl font-bold text-[#0A1E1E] dark:text-white mb-4">Préférences d'affichage</h2>
              <div className="flex items-center justify-between p-4 md:p-6 rounded-2xl bg-[#F4F5F7] dark:bg-white/5 border border-neutral-200 dark:border-neutral-800">
                <div>
                  <p className="font-bold text-sm md:text-base text-[#0A1E1E] dark:text-white">Thème de l'application</p>
                  <p className="text-xs md:text-sm text-neutral-500 mt-1">Actuellement en mode {theme === "dark" ? "sombre" : "clair"}.</p>
                </div>
                <button onClick={toggle} className="p-3 md:p-4 rounded-full bg-white dark:bg-neutral-800 text-[#184F53] dark:text-[#CEEC22] shadow-sm hover:scale-105 transition-transform">
                  {theme === "light" ? <Moon className="w-5 h-5 md:w-6 md:h-6" /> : <Sun className="w-5 h-5 md:w-6 md:h-6" />}
                </button>
              </div>
            </div>
          )}

          {/* 5. CONFIDENTIALITÉ */}
          {activeTab === "confidentialite" && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-xl font-bold text-[#0A1E1E] dark:text-white mb-4">Confidentialité et compte</h2>
              <div className="bg-[#F4F5F7] dark:bg-white/5 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
                <div>
                  <p className="font-bold text-sm text-[#0A1E1E] dark:text-white">Visibilité du profil</p>
                  <p className="text-xs text-neutral-500 mt-1 mb-3">Votre nom et prénom sont visibles sur vos publications.</p>
                  <select className="w-full max-w-xs px-4 py-2.5 rounded-xl bg-white dark:bg-[#0A1E1E] border border-neutral-200 dark:border-neutral-800 text-sm">
                    <option>Public (Recommandé)</option>
                    <option>Privé (Masquer mon nom)</option>
                  </select>
                </div>
                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <p className="font-bold text-sm text-red-500">Zone de danger</p>
                  <p className="text-xs text-neutral-500 mt-1 mb-3">La suppression de votre compte est irréversible.</p>
                  <button className="px-4 py-2 border-2 border-red-500 text-red-500 text-xs font-bold rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">Supprimer mon compte</button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}