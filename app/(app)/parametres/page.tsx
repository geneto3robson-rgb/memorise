"use client";

import { useState } from "react";
import Image from "next/image";
import { User, Lock, Bell, Palette, Shield, Upload } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "@/lib/theme-context";

export default function ParametresPage() {
  const { data: session, isPending } = authClient.useSession();
  const { theme, toggle } = useTheme();
  
  const [activeTab, setActiveTab] = useState<"profil" | "securite" | "notifications" | "affichage" | "confidentialite">("profil");
  
  // États pour le formulaire (à lier avec tRPC plus tard)
  const [nom, setNom] = useState(session?.user?.name || "");
  const [image, setImage] = useState(session?.user?.image || "");

  if (isPending) {
    return <div className="p-10 text-center text-neutral-500">Chargement des paramètres...</div>;
  }

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

      {/* 👇 CONTENEUR PRINCIPAL : Colonne sur mobile, Ligne sur PC */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        
        {/* MENU DE GAUCHE / ONGLETS MOBILE */}
        <aside className="w-full lg:w-64 shrink-0 bg-white dark:bg-[#0A1E1E] rounded-3xl p-2 md:p-4 shadow-sm border border-neutral-100 dark:border-neutral-800">
          
          {/* Header du profil (Caché sur mobile pour gagner de la place) */}
          <div className="hidden lg:flex flex-col items-center mb-6 pt-4">
            <div className="relative w-20 h-20 rounded-full overflow-hidden mb-3 border-2 border-[#CEEC22]">
              {image ? (
                <Image src={image} alt="Profil" fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-[#184F53] text-[#CEEC22] flex items-center justify-center text-2xl font-bold">
                  {session?.user?.name?.charAt(0) || "U"}
                </div>
              )}
            </div>
            <h2 className="text-lg font-bold text-center text-[#0A1E1E] dark:text-white truncate w-full px-2">{session?.user?.name}</h2>
            <p className="text-xs text-neutral-500 capitalize">{session?.user?.email?.includes("@memorise.app") ? "Compte étudiant" : "Étudiant"}</p>
          </div>

          {/* Onglets (Scrollables horizontalement sur mobile) */}
          <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 pb-2 lg:pb-0 scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 md:gap-3 px-4 py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-colors ${
                    isActive 
                      ? "bg-[#CEEC22] text-[#0A1E1E] shadow-sm" 
                      : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" /> 
                  {tab.label}
                </button>
              );
            })}
          </div>
        </aside>

        {/* CONTENU DU FORMULAIRE */}
        <main className="w-full flex-1 bg-white dark:bg-[#0A1E1E] rounded-3xl p-5 md:p-8 shadow-sm border border-neutral-100 dark:border-neutral-800">
          
          {activeTab === "profil" && (
            <div className="space-y-6">
              <h2 className="text-lg md:text-xl font-bold text-[#0A1E1E] dark:text-white mb-4 md:mb-6">Informations personnelles</h2>
              
              {/* Photo de profil */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-[#F4F5F7] dark:bg-white/5 p-4 rounded-2xl">
                <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden shrink-0 border-2 border-white dark:border-neutral-800 shadow-sm">
                  {image ? (
                    <Image src={image} alt="Profil" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#184F53] text-[#CEEC22] flex items-center justify-center text-xl font-bold">
                      {session?.user?.name?.charAt(0) || "U"}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="cursor-pointer px-4 py-2 bg-white dark:bg-[#0A1E1E] border border-neutral-200 dark:border-neutral-700 rounded-full text-xs md:text-sm font-bold text-[#184F53] dark:text-[#CEEC22] flex items-center gap-2 shadow-sm hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors w-fit">
                    <Upload className="w-4 h-4" /> Changer la photo
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setImage(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }} />
                  </label>
                  <p className="text-[10px] md:text-xs text-neutral-500">JPG, PNG ou GIF. Max 2MB.</p>
                </div>
              </div>

              {/* Champs de formulaire */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-xs font-bold text-[#184F53] dark:text-[#CEEC22] mb-2 uppercase tracking-wide">Nom complet</label>
                  <input 
                    type="text" 
                    value={nom} 
                    onChange={(e) => setNom(e.target.value)} 
                    className="w-full px-4 py-3 rounded-xl bg-[#F4F5F7] dark:bg-white/5 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#184F53] text-sm text-[#0A1E1E] dark:text-white font-medium" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#184F53] dark:text-[#CEEC22] mb-2 uppercase tracking-wide">Adresse e-mail</label>
                  <input 
                    type="email" 
                    readOnly 
                    value={session?.user?.email || ""} 
                    className="w-full px-4 py-3 rounded-xl bg-[#F4F5F7] dark:bg-white/5 border border-neutral-200 dark:border-neutral-800 opacity-60 cursor-not-allowed text-sm text-[#0A1E1E] dark:text-white font-medium" 
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
                <button className="w-full sm:w-auto px-6 py-3 bg-[#CEEC22] hover:bg-[#b5d11b] text-[#0A1E1E] text-sm font-bold rounded-full transition-colors shadow-sm">
                  Enregistrer les modifications
                </button>
              </div>
            </div>
          )}

          {activeTab === "affichage" && (
            <div className="space-y-6">
              <h2 className="text-lg md:text-xl font-bold text-[#0A1E1E] dark:text-white mb-4 md:mb-6">Préférences d'affichage</h2>
              
              <div className="flex items-center justify-between p-4 md:p-6 rounded-2xl bg-[#F4F5F7] dark:bg-white/5 border border-neutral-100 dark:border-neutral-800">
                <div>
                  <p className="font-bold text-sm md:text-base text-[#0A1E1E] dark:text-white">Thème de l'application</p>
                  <p className="text-xs md:text-sm text-neutral-500 mt-1">Actuellement en mode {theme === "dark" ? "sombre" : "clair"}.</p>
                </div>
                <button onClick={toggle} className="p-3 md:p-4 rounded-full bg-white dark:bg-neutral-800 text-[#184F53] dark:text-[#CEEC22] shadow-sm hover:scale-105 transition-transform">
                  {theme === "light" ? <Palette className="w-5 h-5 md:w-6 md:h-6" /> : <Palette className="w-5 h-5 md:w-6 md:h-6" />}
                </button>
              </div>
            </div>
          )}

          {/* Autres onglets en construction */}
          {["securite", "notifications", "confidentialite"].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center py-16 md:py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-[#F4F5F7] dark:bg-white/5 flex items-center justify-center mb-4">
                {activeTab === "securite" && <Lock className="w-8 h-8 text-[#184F53] dark:text-[#CEEC22]" />}
                {activeTab === "notifications" && <Bell className="w-8 h-8 text-[#184F53] dark:text-[#CEEC22]" />}
                {activeTab === "confidentialite" && <Shield className="w-8 h-8 text-[#184F53] dark:text-[#CEEC22]" />}
              </div>
              <h3 className="text-lg font-bold text-[#0A1E1E] dark:text-white mb-2">Bientôt disponible</h3>
              <p className="text-sm text-neutral-500 max-w-xs">Cette section est en cours de développement et sera disponible très prochainement.</p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}