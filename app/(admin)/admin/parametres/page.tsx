"use client";

import { useState, useEffect, useRef } from "react";
import { User, Camera, CheckCircle2, ShieldAlert, Lock, Bell, Save, Eye, EyeOff, UserPlus } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { trpc } from "@/trpc/client";

export default function AdminParametresPage() {
  const { data: session, isPending } = authClient.useSession();
  
  // Onglets
  const [activeTab, setActiveTab] = useState<"informations" | "securite" | "notifications" | "administrateurs">("informations");

  // --- ÉTATS INFORMATIONS ---
  const [name, setName] = useState("");
  const [isSavingInfo, setIsSavingInfo] = useState(false);
  const [messageInfo, setMessageInfo] = useState({ type: "", text: "" });

  // Référence pour l'input file caché
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- ÉTATS SÉCURITÉ ---
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSavingSec, setIsSavingSec] = useState(false);
  const [messageSec, setMessageSec] = useState({ type: "", text: "" });

  // --- ÉTATS NOTIFICATIONS ---
  const [notifyNewMemos, setNotifyNewMemos] = useState(true);
  const [notifySystem, setNotifySystem] = useState(false);
  const [isSavingNotif, setIsSavingNotif] = useState(false);
  const [messageNotif, setMessageNotif] = useState({ type: "", text: "" });

  // --- ÉTATS ADMINISTRATEURS ---
  const [adminEmail, setAdminEmail] = useState("");
  const [isPromoting, setIsPromoting] = useState(false);
  const [messageAdmin, setMessageAdmin] = useState({ type: "", text: "" });
  
  const promoteMutation = trpc.admin.promoteUser.useMutation();

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
    }
  }, [session]);

  // --- LOGIQUE INFORMATIONS ---
  const handleSaveInfo = async () => {
    setIsSavingInfo(true);
    setMessageInfo({ type: "", text: "" });
    try {
      await authClient.updateUser({ name });
      setMessageInfo({ type: "success", text: "Informations mises à jour avec succès." });
    } catch (error) {
      setMessageInfo({ type: "error", text: "Erreur lors de la mise à jour." });
    } finally {
      setIsSavingInfo(false);
      setTimeout(() => setMessageInfo({ type: "", text: "" }), 3000);
    }
  };

  // --- LOGIQUE UPLOAD PHOTO ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérification de la taille (Max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setMessageInfo({ type: "error", text: "L'image ne doit pas dépasser 2MB." });
      return;
    }

    setIsSavingInfo(true);
    const reader = new FileReader();
    
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      try {
        await authClient.updateUser({ image: base64String });
        setMessageInfo({ type: "success", text: "Photo de profil mise à jour avec succès." });
        // Forcer le rafraîchissement de la page pour voir la nouvelle image
        window.location.reload();
      } catch (error) {
        setMessageInfo({ type: "error", text: "Erreur lors de la mise à jour de la photo." });
      } finally {
        setIsSavingInfo(false);
        setTimeout(() => setMessageInfo({ type: "", text: "" }), 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  // --- LOGIQUE SÉCURITÉ ---
  const handleSaveSecurite = async () => {
    if (newPassword !== confirmPassword) {
      setMessageSec({ type: "error", text: "Les nouveaux mots de passe ne correspondent pas." });
      return;
    }
    if (newPassword.length < 6) {
      setMessageSec({ type: "error", text: "Le mot de passe doit faire au moins 6 caractères." });
      return;
    }

    setIsSavingSec(true);
    setMessageSec({ type: "", text: "" });
    try {
      await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });
      setMessageSec({ type: "success", text: "Mot de passe modifié avec succès." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      setMessageSec({ type: "error", text: error.message || "Erreur lors du changement de mot de passe." });
    } finally {
      setIsSavingSec(false);
      setTimeout(() => setMessageSec({ type: "", text: "" }), 3000);
    }
  };

  // --- LOGIQUE NOTIFICATIONS ---
  const handleSaveNotif = () => {
    setIsSavingNotif(true);
    setTimeout(() => {
      setIsSavingNotif(false);
      setMessageNotif({ type: "success", text: "Préférences de notification enregistrées." });
      setTimeout(() => setMessageNotif({ type: "", text: "" }), 3000);
    }, 800);
  };

  // --- LOGIQUE ADMINISTRATEURS ---
  const handlePromoteAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail) return;
    
    setIsPromoting(true);
    setMessageAdmin({ type: "", text: "" });
    
    try {
      await promoteMutation.mutateAsync({ email: adminEmail });
      setMessageAdmin({ type: "success", text: "Utilisateur promu administrateur avec succès." });
      setAdminEmail("");
    } catch (error: any) {
      setMessageAdmin({ type: "error", text: error.message || "Erreur lors de la promotion." });
    } finally {
      setIsPromoting(false);
      setTimeout(() => setMessageAdmin({ type: "", text: "" }), 5000);
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

      {/* BARRE D'ONGLETS */}
      <div className="flex bg-white dark:bg-primary-950 p-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 w-full overflow-x-auto shadow-sm">
        <button onClick={() => setActiveTab("informations")} className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeTab === "informations" ? "bg-cta-500 text-primary-900 shadow-md" : "text-neutral-500 hover:text-primary-500 dark:text-neutral-400 dark:hover:bg-white/5"}`}>
          <User className="w-4 h-4" /> <span className="hidden sm:inline">Informations</span>
        </button>
        <button onClick={() => setActiveTab("securite")} className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeTab === "securite" ? "bg-cta-500 text-primary-900 shadow-md" : "text-neutral-500 hover:text-primary-500 dark:text-neutral-400 dark:hover:bg-white/5"}`}>
          <Lock className="w-4 h-4" /> <span className="hidden sm:inline">Sécurité</span>
        </button>
        <button onClick={() => setActiveTab("notifications")} className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeTab === "notifications" ? "bg-cta-500 text-primary-900 shadow-md" : "text-neutral-500 hover:text-primary-500 dark:text-neutral-400 dark:hover:bg-white/5"}`}>
          <Bell className="w-4 h-4" /> <span className="hidden sm:inline">Notifications</span>
        </button>
        <button onClick={() => setActiveTab("administrateurs")} className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeTab === "administrateurs" ? "bg-cta-500 text-primary-900 shadow-md" : "text-neutral-500 hover:text-primary-500 dark:text-neutral-400 dark:hover:bg-white/5"}`}>
          <UserPlus className="w-4 h-4" /> <span className="hidden sm:inline">Administrateurs</span>
        </button>
      </div>

      {/* CONTENU : INFORMATIONS */}
      {activeTab === "informations" && (
        <div className="bg-white dark:bg-primary-950 rounded-[2rem] p-6 md:p-10 border border-neutral-200 dark:border-neutral-800 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
          <h3 className="text-xl font-bold text-primary-900 dark:text-white mb-8">Informations personnelles</h3>

          {messageInfo.text && (
            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${messageInfo.type === "success" ? "bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400" : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"}`}>
              <CheckCircle2 className="w-5 h-5" /> {messageInfo.text}
            </div>
          )}

          <div className="flex flex-col items-center mb-10">
            <div className="relative group">
              <UserAvatar name={session?.user?.name} image={session?.user?.image} className="w-28 h-28 text-3xl border-4 border-neutral-100 dark:border-neutral-800 shadow-lg" />
              <div 
                className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            
            {/* Input caché pour l'upload */}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
            />
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-100 dark:bg-primary-500/20 border border-neutral-200 dark:border-neutral-700 text-sm font-bold text-primary-500 dark:text-cta-500 hover:bg-neutral-200 transition-colors"
            >
              <Camera className="w-4 h-4" /> Changer la photo
            </button>
            <p className="text-xs text-neutral-400 mt-2">JPG, PNG ou GIF. Max 2MB.</p>
          </div>

          <div className="space-y-6 max-w-2xl mx-auto">
            <div>
              <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-2 ml-1 uppercase tracking-wider">Nom complet</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full h-14 px-5 bg-neutral-50 dark:bg-primary-950 border border-transparent focus:border-primary-500 dark:focus:border-cta-500 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary-500/20 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-2 ml-1 uppercase tracking-wider">Adresse e-mail</label>
              <input type="email" value={session?.user?.email || ""} disabled className="w-full h-14 px-5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-sm font-medium text-neutral-500 cursor-not-allowed" />
              <p className="text-xs text-neutral-400 mt-2 ml-1 flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> L'adresse e-mail ne peut pas être modifiée.</p>
            </div>
          </div>

          <div className="mt-10 flex justify-end max-w-2xl mx-auto">
            <button onClick={handleSaveInfo} disabled={isSavingInfo || name === session?.user?.name} className="px-8 py-3 rounded-full bg-cta-500 text-primary-900 font-bold text-sm hover:bg-cta-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center gap-2">
              <Save className="w-4 h-4" /> {isSavingInfo ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </div>
      )}

      {/* CONTENU : SÉCURITÉ (Inchangé) */}
      {activeTab === "securite" && (
        <div className="bg-white dark:bg-primary-950 rounded-[2rem] p-6 md:p-10 border border-neutral-200 dark:border-neutral-800 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
          <h3 className="text-xl font-bold text-primary-900 dark:text-white mb-8">Sécurité du compte</h3>

          {messageSec.text && (
            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${messageSec.type === "success" ? "bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400" : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"}`}>
              <CheckCircle2 className="w-5 h-5" /> {messageSec.text}
            </div>
          )}

          <div className="space-y-6 max-w-2xl mx-auto">
            <div>
              <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-2 ml-1 uppercase tracking-wider">Mot de passe actuel</label>
              <div className="relative">
                <input type={showCurrent ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" className="w-full h-14 px-5 pr-14 bg-neutral-50 dark:bg-primary-950 border border-transparent focus:border-primary-500 dark:focus:border-cta-500 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary-500/20 transition-all" />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-primary-900 dark:hover:text-white transition-colors">
                  {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-2 ml-1 uppercase tracking-wider">Nouveau mot de passe</label>
              <div className="relative">
                <input type={showNew ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" className="w-full h-14 px-5 pr-14 bg-neutral-50 dark:bg-primary-950 border border-transparent focus:border-primary-500 dark:focus:border-cta-500 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary-500/20 transition-all" />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-primary-900 dark:hover:text-white transition-colors">
                  {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-2 ml-1 uppercase tracking-wider">Confirmer le nouveau mot de passe</label>
              <div className="relative">
                <input type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full h-14 px-5 pr-14 bg-neutral-50 dark:bg-primary-950 border border-transparent focus:border-primary-500 dark:focus:border-cta-500 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary-500/20 transition-all" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-primary-900 dark:hover:text-white transition-colors">
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-end max-w-2xl mx-auto">
            <button onClick={handleSaveSecurite} disabled={isSavingSec || !currentPassword || !newPassword || !confirmPassword} className="px-8 py-3 rounded-full bg-cta-500 text-primary-900 font-bold text-sm hover:bg-cta-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center gap-2">
              <Lock className="w-4 h-4" /> {isSavingSec ? "Mise à jour..." : "Modifier le mot de passe"}
            </button>
          </div>
        </div>
      )}

      {/* CONTENU : NOTIFICATIONS (Inchangé) */}
      {activeTab === "notifications" && (
        <div className="bg-white dark:bg-primary-950 rounded-[2rem] p-6 md:p-10 border border-neutral-200 dark:border-neutral-800 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
          <h3 className="text-xl font-bold text-primary-900 dark:text-white mb-8">Préférences de notification</h3>

          {messageNotif.text && (
            <div className="mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400">
              <CheckCircle2 className="w-5 h-5" /> {messageNotif.text}
            </div>
          )}

          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-between p-5 bg-neutral-50 dark:bg-primary-900/50 rounded-2xl border border-neutral-100 dark:border-neutral-800">
              <div>
                <p className="font-bold text-primary-900 dark:text-white">Nouveaux mémoires</p>
                <p className="text-sm text-neutral-500 mt-1">Recevoir une alerte quand un nouveau mémoire est publié.</p>
              </div>
              <button onClick={() => setNotifyNewMemos(!notifyNewMemos)} className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${notifyNewMemos ? 'bg-cta-500' : 'bg-neutral-300 dark:bg-neutral-700'}`}>
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${notifyNewMemos ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-5 bg-neutral-50 dark:bg-primary-900/50 rounded-2xl border border-neutral-100 dark:border-neutral-800">
              <div>
                <p className="font-bold text-primary-900 dark:text-white">Alertes système</p>
                <p className="text-sm text-neutral-500 mt-1">Recevoir des notifications sur l'état de la plateforme.</p>
              </div>
              <button onClick={() => setNotifySystem(!notifySystem)} className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${notifySystem ? 'bg-cta-500' : 'bg-neutral-300 dark:bg-neutral-700'}`}>
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${notifySystem ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          <div className="mt-10 flex justify-end max-w-2xl mx-auto">
            <button onClick={handleSaveNotif} disabled={isSavingNotif} className="px-8 py-3 rounded-full bg-cta-500 text-primary-900 font-bold text-sm hover:bg-cta-400 transition-colors shadow-md flex items-center gap-2">
              <Save className="w-4 h-4" /> {isSavingNotif ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </div>
      )}

      {/* CONTENU : ADMINISTRATEURS */}
      {activeTab === "administrateurs" && (
        <div className="bg-white dark:bg-primary-950 rounded-[2rem] p-6 md:p-10 border border-neutral-200 dark:border-neutral-800 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
          <h3 className="text-xl font-bold text-primary-900 dark:text-white mb-2">Gestion des administrateurs</h3>
          <p className="text-sm text-neutral-500 mb-8">Promouvez un étudiant ou un enseignant en administrateur en saisissant son adresse e-mail.</p>

          {messageAdmin.text && (
            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${messageAdmin.type === "success" ? "bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400" : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"}`}>
              <CheckCircle2 className="w-5 h-5" /> {messageAdmin.text}
            </div>
          )}

          <form onSubmit={handlePromoteAdmin} className="max-w-2xl mx-auto space-y-6">
            <div>
              <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-2 ml-1 uppercase tracking-wider">Adresse e-mail de l'utilisateur</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  required
                  value={adminEmail} 
                  onChange={(e) => setAdminEmail(e.target.value)} 
                  placeholder="ex: etudiant@memorise.app" 
                  className="w-full h-14 px-5 bg-neutral-50 dark:bg-primary-950 border border-transparent focus:border-primary-500 dark:focus:border-cta-500 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary-500/20 transition-all" 
                />
                <button 
                  type="submit" 
                  disabled={isPromoting || !adminEmail} 
                  className="h-14 px-8 shrink-0 rounded-full bg-cta-500 text-primary-900 font-bold text-sm hover:bg-cta-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" /> {isPromoting ? "Promotion..." : "Promouvoir Admin"}
                </button>
              </div>
              <p className="text-xs text-neutral-400 mt-3 ml-1">
                Attention : Cette action donne à l'utilisateur un accès complet à la modération et aux statistiques.
              </p>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}