"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { User, Lock, Upload, ShieldCheck, Moon, Sun, Palette } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "@/lib/theme-context";

const inputClass = "w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-[#F4F5F7] dark:bg-[#051414] text-[#0A1E1E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#184F53] shadow-sm font-medium";
const labelClass = "block text-xs font-bold text-[#184F53] dark:text-[#CEEC22] mb-2 uppercase tracking-wide";
const btnPrimary = "px-6 py-3 rounded-full bg-[#CEEC22] hover:bg-[#b5d11b] text-[#0A1E1E] text-sm font-bold transition-all shadow-md";

export default function AdminParametresPage() {
  const { data: session } = authClient.useSession();
  const { theme, toggle } = useTheme();
  
  const [activeTab, setActiveTab] = useState<"profil" | "securite" | "affichage">("profil");
  const [nom, setNom] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (session?.user) {
      setNom(session.user.name || "");
      setImage(session.user.image || "");
    }
  }, [session]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await authClient.updateUser({ name: nom, image: image || undefined });
    alert("Profil administrateur mis à jour !");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-[#0A1E1E] dark:text-white tracking-tight">Paramètres</h1>
        <p className="text-neutral-500 mt-1">Gérez votre compte administrateur.</p>
      </div>

      <div className="flex gap-2 p-1 bg-[#F4F5F7] dark:bg-[#0A1E1E] rounded-full w-fit border border-neutral-200 dark:border-neutral-800">
        <button onClick={() => setActiveTab("profil")} className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === "profil" ? "bg-[#184F53] text-white shadow-md" : "text-neutral-500 hover:text-[#184F53] dark:hover:text-white"}`}>
          <User className="w-4 h-4" /> Profil
        </button>
        <button onClick={() => setActiveTab("securite")} className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === "securite" ? "bg-[#184F53] text-white shadow-md" : "text-neutral-500 hover:text-[#184F53] dark:hover:text-white"}`}>
          <Lock className="w-4 h-4" /> Sécurité
        </button>
        <button onClick={() => setActiveTab("affichage")} className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === "affichage" ? "bg-[#184F53] text-white shadow-md" : "text-neutral-500 hover:text-[#184F53] dark:hover:text-white"}`}>
          <Palette className="w-4 h-4" /> Affichage
        </button>
      </div>

      <div className="bg-white dark:bg-[#0A1E1E] rounded-[2rem] p-8 shadow-sm border border-neutral-100 dark:border-neutral-800">
        
        {activeTab === "profil" && (
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="flex items-center gap-6 p-4 rounded-2xl bg-[#F4F5F7] dark:bg-[#051414]">
              <div className="relative w-20 h-20 shrink-0">
                <Image src={image || "/images/authors/authors1.jpg"} alt="Avatar" fill sizes="80px" className="rounded-full object-cover border-2 border-white shadow-sm" />
              </div>
              <label className="cursor-pointer text-sm font-bold text-[#184F53] dark:text-[#CEEC22] bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-full px-5 py-2.5 flex items-center gap-2 shadow-sm">
                <Upload className="w-4 h-4" /> Changer la photo
                <input type="file" accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setImage(reader.result as string);
                    reader.readAsDataURL(file);
                  }
                }} className="hidden" />
              </label>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Nom complet</label>
                <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Adresse e-mail</label>
                <input type="email" value={session?.user?.email || ""} readOnly className={inputClass + " opacity-60 cursor-not-allowed"} />
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <button type="submit" className={btnPrimary}>Mettre à jour le profil</button>
            </div>
          </form>
        )}

        {activeTab === "securite" && (
          <div className="text-center py-10">
            <ShieldCheck className="w-12 h-12 text-[#CEEC22] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#0A1E1E] dark:text-white">Sécurité du compte</h3>
            <p className="text-sm text-neutral-500 mb-6 max-w-sm mx-auto">La modification du mot de passe pour les administrateurs se fait via le même formulaire que l'espace étudiant.</p>
          </div>
        )}

        {activeTab === "affichage" && (
          <div className="flex items-center justify-between p-6 rounded-2xl bg-[#F4F5F7] dark:bg-[#051414] border border-neutral-100 dark:border-neutral-800">
            <div>
              <p className="font-bold text-[#0A1E1E] dark:text-white">Thème de l'application</p>
              <p className="text-sm text-neutral-500">Actuellement en mode {theme === "dark" ? "sombre" : "clair"}.</p>
            </div>
            <button onClick={toggle} aria-label="Changer de thème" className="p-4 rounded-full bg-white dark:bg-neutral-800 text-[#184F53] dark:text-[#CEEC22] shadow-sm hover:scale-105 transition-transform">
              {theme === "light" ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}