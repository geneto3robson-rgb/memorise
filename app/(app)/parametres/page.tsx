"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { 
  User, Lock, Bell, Palette, Shield, Upload, Moon, Sun, 
  ChevronDown, CheckCircle2, Loader2, Eye, EyeOff, Save // Ajout de l'icône Save
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/trpc/client";
import { useTheme } from "@/lib/theme-context";
import { filieres } from "@/lib/data/filieres";
import { useRouter } from "next/navigation";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}
function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}
function WhatsappIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}

function formatWhatsAppInput(value: string) {
  let cleaned = value.replace(/\D/g, "");
  if (cleaned.startsWith("261")) cleaned = cleaned.substring(3);
  if (cleaned.startsWith("0")) cleaned = cleaned.substring(1);
  return cleaned;
}

const inputClass = "w-full px-4 py-3 rounded-xl bg-[#F4F5F7] dark:bg-white/5 border border-neutral-200 dark:border-neutral-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#184F53] transition-all";
const labelClass = "block text-xs font-bold text-[#184F53] dark:text-[#CEEC22] mb-2 uppercase tracking-wide";

export default function ParametresPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const { theme, toggle } = useTheme();
  
  const [activeTab, setActiveTab] = useState<"profil" | "securite" | "notifications" | "affichage" | "confidentialite">("profil");
  
  // Infos
  const [nom, setNom] = useState("");
  const [image, setImage] = useState("");
  const [filiereCode, setFiliereCode] = useState("");
  const [parcours, setParcours] = useState("");
  const [statut, setStatut] = useState("Étudiant actuel");
  const [facebook, setFacebook] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  
  // Sécurité
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isChangingPwd, setIsChangingPwd] = useState(false);

  // Notifications
  const [notifyNews, setNotifyNews] = useState(true);
  const [notifyPublications, setNotifyPublications] = useState(true);
  const [isSavingNotif, setIsSavingNotif] = useState(false); // Nouvel état pour le bouton Enregistrer

  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: profileData } = trpc.profile.get.useQuery(undefined, { enabled: !!session, staleTime: 5 * 60 * 1000 });
  
  const updateProfile = trpc.profile.update.useMutation({
    onSuccess: () => {
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    }
  });

  useEffect(() => {
    if (session?.user) {
      setNom(session.user.name || "");
      setImage(session.user.image || "");
    }
    if (profileData?.profile) {
      setFiliereCode(profileData.filiereCode || "");
      setParcours(profileData.profile.parcours || "");
      setStatut(profileData.profile.statut || "Étudiant actuel");
      setFacebook(profileData.profile.facebook || "");
      setLinkedin(profileData.profile.linkedin || "");
      setNotifyNews(profileData.profile.notifyNews ?? true);
      setNotifyPublications(profileData.profile.notifyPublications ?? true);
      if (profileData.profile.whatsapp) setWhatsapp(formatWhatsAppInput(profileData.profile.whatsapp));
    }
  }, [session, profileData]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F5F7] dark:bg-[#051414]">
        <Loader2 className="w-8 h-8 animate-spin text-[#184F53] dark:text-[#CEEC22]" />
      </div>
    );
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    await authClient.updateUser({ name: nom, image: image || undefined });
    updateProfile.mutate({
      filiereCode: filiereCode || null,
      parcours: parcours,
      statut: statut,
      facebook: facebook || undefined,
      linkedin: linkedin || undefined,
      whatsapp: whatsapp ? `+261${formatWhatsAppInput(whatsapp)}` : undefined,
    });
  };

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) return alert("Les nouveaux mots de passe ne correspondent pas.");
    if (newPassword.length < 6) return alert("Le mot de passe doit faire au moins 6 caractères.");
    
    setIsChangingPwd(true);
    const { error } = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    });
    setIsChangingPwd(false);

    if (error) {
      alert("Erreur : " + error.message);
    } else {
      alert("Mot de passe modifié avec succès !");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    }
  };

  // Nouvelle fonction pour sauvegarder les paramètres de notification
  const handleSaveNotifications = () => {
    setIsSavingNotif(true);
    updateProfile.mutate({
      notifyNews,
      notifyPublications,
    }, {
      onSuccess: () => {
        setIsSavingNotif(false);
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 3000);
      },
      onError: () => setIsSavingNotif(false)
    });
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible.")) {
      const { error } = await authClient.deleteUser();
      if (error) {
        alert("Erreur lors de la suppression : " + error.message);
      } else {
        alert("Votre compte a été supprimé.");
        router.push("/");
      }
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

        <main className="w-full flex-1 bg-white dark:bg-[#0A1E1E] rounded-3xl p-5 md:p-8 shadow-sm border border-neutral-100 dark:border-neutral-800 min-h-[500px]">
          
          {activeTab === "profil" && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-xl font-bold text-[#0A1E1E] dark:text-white mb-4">Informations personnelles</h2>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-[#F4F5F7] dark:bg-white/5 p-4 rounded-2xl">
                <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden shrink-0 border-2 border-white dark:border-neutral-800 shadow-sm">
                  {image ? <Image src={image} alt="Profil" fill className="object-cover" /> : <div className="w-full h-full bg-[#184F53] text-[#CEEC22] flex items-center justify-center text-xl font-bold">{nom.charAt(0).toUpperCase()}</div>}
                </div>
                <div className="flex flex-col gap-2">
                  <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
                  <button onClick={() => fileInputRef.current?.click()} className="cursor-pointer px-4 py-2 bg-white dark:bg-[#0A1E1E] border border-neutral-200 dark:border-neutral-700 rounded-full text-xs md:text-sm font-bold text-[#184F53] dark:text-[#CEEC22] flex items-center gap-2 shadow-sm hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors w-fit">
                    <Upload className="w-4 h-4" /> Changer la photo
                  </button>
                  <p className="text-[10px] md:text-xs text-neutral-500">JPG, PNG ou GIF. Max 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className={labelClass}>Nom complet</label>
                  <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Adresse e-mail</label>
                  <input type="email" readOnly value={session?.user?.email || ""} className={inputClass + " opacity-60 cursor-not-allowed"} />
                </div>
                
                <div>
                  <label className={labelClass}>Mention</label>
                  <div className="relative">
                    <select value={filiereCode} onChange={(e) => setFiliereCode(e.target.value)} className={inputClass + " appearance-none pr-10"}>
                      <option value="" className="bg-white dark:bg-[#0A1E1E] text-[#0A1E1E] dark:text-white">Sélectionner...</option>
                      {filieres.map(f => <option key={f.id} value={f.code} className="bg-white dark:bg-[#0A1E1E] text-[#0A1E1E] dark:text-white">{f.code} — {f.name}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Parcours</label>
                  <input type="text" value={parcours} onChange={(e) => setParcours(e.target.value)} placeholder="Ex: STI, RS, RC..." className={inputClass} />
                </div>
                
                <div>
                  <label className={labelClass}>Statut</label>
                  <div className="relative">
                    <select value={statut} onChange={(e) => setStatut(e.target.value)} className={inputClass + " appearance-none pr-10"}>
                      <option value="Étudiant actuel" className="bg-white dark:bg-[#0A1E1E] text-[#0A1E1E] dark:text-white">Étudiant actuel</option>
                      <option value="Ancien étudiant" className="bg-white dark:bg-[#0A1E1E] text-[#0A1E1E] dark:text-white">Ancien étudiant</option>
                      <option value="Enseignant" className="bg-white dark:bg-[#0A1E1E] text-[#0A1E1E] dark:text-white">Enseignant</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="border-t border-neutral-100 dark:border-neutral-800 pt-6 mt-6">
                <h3 className="text-sm font-bold text-[#0A1E1E] dark:text-white mb-4">Contacts publics (facultatif)</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="relative">
                    <FacebookIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1877F2]" />
                    <input type="text" value={facebook} onChange={(e) => setFacebook(e.target.value)} placeholder="Lien Facebook" className={inputClass + " pl-10"} />
                  </div>
                  <div className="relative">
                    <LinkedinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0A66C2]" />
                    <input type="text" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="Lien LinkedIn" className={inputClass + " pl-10"} />
                  </div>
                  <div className="relative">
                    <WhatsappIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#25D366]" />
                    <span className="absolute left-10 top-1/2 -translate-y-1/2 text-sm text-neutral-500 font-medium">+261</span>
                    <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(formatWhatsAppInput(e.target.value))} placeholder="-- -- --- --" className={inputClass + " pl-[5.5rem]"} />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end gap-4">
                {isSuccess && <span className="text-green-600 text-sm font-medium flex items-center gap-1 animate-in fade-in"><CheckCircle2 className="w-4 h-4" /> Enregistré !</span>}
                <button 
                  onClick={handleSave} 
                  disabled={updateProfile.isPending}
                  className="px-6 py-3 bg-[#CEEC22] hover:bg-[#b5d11b] text-[#0A1E1E] text-sm font-bold rounded-full transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {updateProfile.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  {updateProfile.isPending ? "Enregistrement..." : "Enregistrer les modifications"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "securite" && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-xl font-bold text-[#0A1E1E] dark:text-white mb-4">Sécurité et connexion</h2>
              <div className="bg-[#F4F5F7] dark:bg-white/5 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800">
                <h3 className="font-bold text-sm text-[#0A1E1E] dark:text-white mb-4">Changer le mot de passe</h3>
                <div className="space-y-4 max-w-md">
                  <div className="relative">
                    <input type={showCurrent ? "text" : "password"} placeholder="Mot de passe actuel" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={inputClass + " pr-10"} />
                    <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#184F53]">
                      {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="relative">
                    <input type={showNew ? "text" : "password"} placeholder="Nouveau mot de passe" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClass + " pr-10"} />
                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#184F53]">
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="relative">
                    <input type={showConfirm ? "text" : "password"} placeholder="Confirmer le nouveau mot de passe" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass + " pr-10"} />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#184F53]">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <button onClick={handlePasswordUpdate} disabled={isChangingPwd} className="px-6 py-2.5 bg-[#184F53] text-white text-sm font-bold rounded-full hover:bg-[#123a3d] transition-colors mt-2 flex items-center gap-2">
                    {isChangingPwd && <Loader2 className="w-4 h-4 animate-spin" />}
                    Mettre à jour le mot de passe
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ONGLET NOTIFICATIONS MIS À JOUR */}
          {activeTab === "notifications" && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-xl font-bold text-[#0A1E1E] dark:text-white mb-4">Préférences de notification</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-5 bg-[#F4F5F7] dark:bg-white/5 rounded-2xl border border-neutral-200 dark:border-neutral-800">
                  <div>
                    <p className="font-bold text-sm text-[#0A1E1E] dark:text-white">Nouvelles publications</p>
                    <p className="text-xs text-neutral-500 mt-1">Recevoir un e-mail quand un nouveau mémoire est publié.</p>
                  </div>
                  <button 
                    onClick={() => setNotifyNews(!notifyNews)} 
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${notifyNews ? 'bg-[#184F53] dark:bg-[#CEEC22]' : 'bg-neutral-300 dark:bg-neutral-700'}`}
                  >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${notifyNews ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-5 bg-[#F4F5F7] dark:bg-white/5 rounded-2xl border border-neutral-200 dark:border-neutral-800">
                  <div>
                    <p className="font-bold text-sm text-[#0A1E1E] dark:text-white">Mises à jour de la plateforme</p>
                    <p className="text-xs text-neutral-500 mt-1">Recevoir des informations sur les nouvelles fonctionnalités.</p>
                  </div>
                  <button 
                    onClick={() => setNotifyPublications(!notifyPublications)} 
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${notifyPublications ? 'bg-[#184F53] dark:bg-[#CEEC22]' : 'bg-neutral-300 dark:bg-neutral-700'}`}
                  >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${notifyPublications ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800 flex justify-end mt-6">
                {isSuccess && <span className="text-green-600 text-sm font-medium flex items-center gap-1 animate-in fade-in mr-4"><CheckCircle2 className="w-4 h-4" /> Enregistré !</span>}
                <button 
                  onClick={handleSaveNotifications} 
                  disabled={isSavingNotif}
                  className="px-6 py-3 bg-[#CEEC22] hover:bg-[#b5d11b] text-[#0A1E1E] text-sm font-bold rounded-full transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {isSavingNotif ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isSavingNotif ? "Enregistrement..." : "Enregistrer les préférences"}
                </button>
              </div>
            </div>
          )}

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

          {activeTab === "confidentialite" && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-xl font-bold text-[#0A1E1E] dark:text-white mb-4">Confidentialité et compte</h2>
              <div className="bg-[#F4F5F7] dark:bg-white/5 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-6">
                <div>
                  <p className="font-bold text-sm text-[#0A1E1E] dark:text-white">Visibilité du profil</p>
                  <p className="text-xs text-neutral-500 mt-1 mb-3">Votre nom et prénom sont visibles sur vos publications.</p>
                  <div className="relative max-w-xs">
                    <select className={inputClass + " appearance-none pr-10"}>
                      <option className="bg-white dark:bg-[#0A1E1E] text-[#0A1E1E] dark:text-white">Public (Recommandé)</option>
                      <option className="bg-white dark:bg-[#0A1E1E] text-[#0A1E1E] dark:text-white">Privé (Masquer mon nom)</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                  </div>
                </div>
                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <p className="font-bold text-sm text-red-500">Zone de danger</p>
                  <p className="text-xs text-neutral-500 mt-1 mb-3">La suppression de votre compte est irréversible.</p>
                  <button onClick={handleDeleteAccount} className="px-4 py-2 border-2 border-red-500 text-red-500 text-xs font-bold rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">Supprimer mon compte</button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}