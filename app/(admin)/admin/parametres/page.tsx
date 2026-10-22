"use client";

import { useState, useEffect } from "react";
import { User, Lock, Bell, Camera, CheckCircle2, ShieldAlert } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { UserAvatar } from "@/components/ui/UserAvatar";

export default function AdminParametresPage() {
  const [activeTab, setActiveTab] = useState<"informations" | "securite" | "notifications">("informations");
  
  // 👇 CORRECTION 1 : On retire "update" du useSession 👇
  const { data: session, isPending } = authClient.useSession();
  
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
    }
  }, [session]);

  const handleSaveInfo = async () => {
    setIsSaving(true);
    setMessage({ type: "", text: "" });
    try {
      // 👇 CORRECTION 2 : Utilisation de authClient.updateUser 👇
      await authClient.updateUser({ name });
      setMessage({ type: "success", text: "Informations mises à jour avec succès." });
    } catch (error) {
      setMessage({ type: "error", text: "Erreur lors de la mise à jour." });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-4 border-primary-500 border-t-cta-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 pb-10">
      
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-primary-900 dark:text-white tracking-tight">Paramètres</h2>
        <p className="text-sm md:text-base text-neutral-500 mt-1">Gérez votre compte et vos préférences.</p>
      </div>

      {/* Onglets */}
      <div className="flex bg-white dark:bg-primary-950 p-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 w-full sm:w-auto overflow-x-auto shadow-sm">
        <button
          onClick={() => setActiveTab("informations")}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all ${
            activeTab === "informations" 
              ? "bg-cta-500 text-primary-900 shadow-md" 
              : "text-neutral-500 hover:text-primary-500 dark:text-neutral-400 dark:hover:bg-white/5"
          }`}
        >
          <User className="w-4 h-4" /> Informations
        </button>
        <button
          onClick={() => setActiveTab("securite")}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all ${
            activeTab === "securite" 
              ? "bg-cta-500 text-primary-900 shadow-md" 
              : "text-neutral-500 hover:text-primary-500 dark:text-neutral-400 dark:hover:bg-white/5"
          }`}
        >
          <Lock className="w-4 h-4" /> Sécurité
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all ${
            activeTab === "notifications" 
              ? "bg-cta-500 text-primary-900 shadow-md" 
              : "text-neutral-500 hover:text-primary-500 dark:text-neutral-400 dark:hover:bg-white/5"
          }`}
        >
          <Bell className="w-4 h-4" /> Notifications
        </button>
      </div>

      {/* CONTENU : INFORMATIONS */}
      {activeTab === "informations" && (
        <div className="bg-white dark:bg-primary-950 rounded-[2rem] p-6 md:p-10 border border-neutral-200 dark:border-neutral-800 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
          <h3 className="text-xl font-bold text-primary-900 dark:text-white mb-8">Informations personnelles</h3>

          {message.text && (
            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
              message.type === "success" 
                ? "bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400" 
                : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
            }`}>
              <CheckCircle2 className="w-5 h-5" />
              {message.text}
            </div>
          )}

          <div className="flex flex-col items-center mb-10">
            <div className="relative group">
              <UserAvatar 
                name={session?.user?.name} 
                image={session?.user?.image} 
                className="w-28 h-28 text-3xl border-4 border-neutral-100 dark:border-neutral-800 shadow-lg" 
              />
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            <button className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-100 dark:bg-primary-500/20 border border-neutral-200 dark:border-neutral-700 text-sm font-bold text-primary-500 dark:text-cta-500 hover:bg-neutral-200 dark:hover:bg-primary-500/40 transition-colors">
              <Camera className="w-4 h-4" /> Changer la photo
            </button>
            <p className="text-xs text-neutral-400 mt-2">JPG, PNG ou GIF. Max 2MB.</p>
          </div>

          <div className="space-y-6 max-w-2xl mx-auto">
            <div>
              <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-2 ml-1 uppercase tracking-wider">
                Nom complet
              </label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-14 px-5 bg-neutral-50 dark:bg-primary-950 border border-transparent focus:border-primary-500 dark:focus:border-cta-500 rounded-2xl text-sm md:text-base font-medium text-primary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-2 ml-1 uppercase tracking-wider">
                Adresse e-mail
              </label>
              <input 
                type="email" 
                value={session?.user?.email || ""}
                disabled
                className="w-full h-14 px-5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-sm md:text-base font-medium text-neutral-500 cursor-not-allowed"
              />
              <p className="text-xs text-neutral-400 mt-2 ml-1 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" /> L'adresse e-mail ne peut pas être modifiée.
              </p>
            </div>
          </div>

          <div className="mt-10 flex justify-end max-w-2xl mx-auto">
            <button 
              onClick={handleSaveInfo}
              disabled={isSaving || name === session?.user?.name}
              className="px-8 py-3 rounded-full bg-cta-500 text-primary-900 font-bold text-sm md:text-base hover:bg-cta-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
            </button>
          </div>
        </div>
      )}

      {/* CONTENU : SECURITE */}
      {activeTab === "securite" && (
        <div className="bg-white dark:bg-primary-950 rounded-[2rem] p-6 md:p-10 border border-neutral-200 dark:border-neutral-800 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
          <h3 className="text-xl font-bold text-primary-900 dark:text-white mb-6">Sécurité du compte</h3>
          <p className="text-neutral-500 text-sm">La gestion du mot de passe pour l'administrateur est gérée par le système d'authentification central.</p>
        </div>
      )}

      {/* CONTENU : NOTIFICATIONS */}
      {activeTab === "notifications" && (
        <div className="bg-white dark:bg-primary-950 rounded-[2rem] p-6 md:p-10 border border-neutral-200 dark:border-neutral-800 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
          <h3 className="text-xl font-bold text-primary-900 dark:text-white mb-6">Préférences de notification</h3>
          <p className="text-neutral-500 text-sm">Les notifications d'administration sont toujours activées.</p>
        </div>
      )}

    </div>
  );
}