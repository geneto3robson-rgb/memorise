"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { User, Lock, Bell, Palette, Shield, Upload, Moon, Sun, ChevronDown } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "@/lib/theme-context";
import { filieres } from "@/lib/data/filieres";

export default function ParametresPage() {
  const { data: session, isPending } = authClient.useSession();
  const { theme, toggle } = useTheme();
  
  const [activeTab, setActiveTab] = useState<"profil" | "securite" | "notifications" | "affichage" | "confidentialite">("profil");
  
  const [nom, setNom] = useState(session?.user?.name || "");
  const [image, setImage] = useState(session?.user?.image || "");
  const [filiere, setFiliere] = useState("");
  const [parcours, setParcours] = useState("");
  const [statut, setStatut] = useState("Étudiant actuel");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (isPending) return <div className="p-10 text-center text-neutral-500">Chargement...</div>;

  // 👇 FONCTION POUR CHANGER LA PHOTO 👇
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        // Ici tu pourras ajouter une mutation tRPC pour envoyer l'image à la BDD
      };
      reader.readAsDataURL(file);
    }
  };

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
        <aside className="w-full lg:w-64 shrink-0 bg-white dark:bg-[#0A1E1E] rounded-3xl p-2 md:p-4 shadow-sm border border-neutral-100 dark:border-neutral-800">
          {/* ... Sidebar menu ... */}
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

        <main className="w-full flex-1 bg-white dark:bg-[#0A1E1E] rounded-3xl p-5 md:p-8 shadow-sm border border-neutral-100 dark:border-neutral-800">
          
          {activeTab === "profil" && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-xl font-bold text-[#0A1E1E] dark:text-white mb-4">Informations personnelles</h2>
              
              {/* 👇 LOGIQUE PHOTO AJOUTÉE 👇 */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-[#F4F5F7] dark:bg-white/5 p-4 rounded-2xl">
                <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden shrink-0 border-2 border-white dark:border-neutral-800">
                  {image ? <Image src={image} alt="Profil" fill className="object-cover" /> : <div className="w-full h-full bg-[#184F53] text-[#CEEC22] flex items-center justify-center text-xl font-bold">{nom.charAt(0)}</div>}
                </div>
                <div className="flex flex-col gap-2">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleImageChange} 
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer px-4 py-2 bg-white dark:bg-[#0A1E1E] border border-neutral-200 dark:border-neutral-700 rounded-full text-xs md:text-sm font-bold text-[#184F53] dark:text-[#CEEC22] flex items-center gap-2 shadow-sm hover:bg-neutral-50 w-fit"
                  >
                    <Upload className="w-4 h-4" /> Changer la photo
                  </button>
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
                
                {/* 👇 CORRECTION DU PADDING SELECT 👇 */}
                <div>
                  <label className="block text-xs font-bold text-[#184F53] dark:text-[#CEEC22] mb-2 uppercase">Filière</label>
                  <div className="relative">
                    <select value={filiere} onChange={(e) => setFiliere(e.target.value)} className="w-full px-4 py-3 pr-10 appearance-none rounded-xl bg-[#F4F5F7] dark:bg-white/5 border border-neutral-200 dark:border-neutral-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#184F53]">
                      <option value="">Sélectionner...</option>
                      {filieres.map(f => <option key={f.id} value={f.code}>{f.code} — {f.name}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#184F53] dark:text-[#CEEC22] mb-2 uppercase">Parcours</label>
                  <input type="text" value={parcours} onChange={(e) => setParcours(e.target.value)} placeholder="Ex: STI, RS, RC..." className="w-full px-4 py-3 rounded-xl bg-[#F4F5F7] dark:bg-white/5 border border-neutral-200 dark:border-neutral-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#184F53]" />
                </div>
                
                {/* 👇 CORRECTION DU PADDING SELECT STATUT 👇 */}
                <div>
                  <label className="block text-xs font-bold text-[#184F53] dark:text-[#CEEC22] mb-2 uppercase">Statut</label>
                  <div className="relative">
                    <select value={statut} onChange={(e) => setStatut(e.target.value)} className="w-full px-4 py-3 pr-10 appearance-none rounded-xl bg-[#F4F5F7] dark:bg-white/5 border border-neutral-200 dark:border-neutral-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#184F53]">
                      <option>Étudiant actuel</option>
                      <option>Ancien étudiant</option>
                      <option>Enseignant</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
                <button className="px-6 py-3 bg-[#CEEC22] hover:bg-[#b5d11b] text-[#0A1E1E] text-sm font-bold rounded-full transition-colors shadow-sm">Enregistrer les modifications</button>
              </div>
            </div>
          )}

          {/* ... Autres onglets ... */}
        </main>
      </div>
    </div>
  );
}