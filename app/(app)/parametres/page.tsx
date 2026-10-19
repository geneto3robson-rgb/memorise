"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, Lock, Bell, Palette, Shield, Moon, Sun, Upload, ChevronDown } from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { trpc } from "@/trpc/client";
import { authClient } from "@/lib/auth-client";
import { filieres } from "@/lib/data/filieres";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}
function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
function WhatsappIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function formatWhatsAppInput(value: string) {
  let cleaned = value.replace(/\D/g, "");
  if (cleaned.startsWith("261")) cleaned = cleaned.substring(3);
  if (cleaned.startsWith("0")) cleaned = cleaned.substring(1);
  return cleaned;
}

const inputClass = "w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-[#F4F5F7] dark:bg-[#0A1E1E] text-[#0A1E1E] dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#184F53] focus:border-transparent transition-all shadow-sm disabled:opacity-50 font-medium";
const selectClass = `${inputClass} appearance-none pr-10 cursor-pointer`;
const iconInputClass = "w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-[#F4F5F7] dark:bg-[#0A1E1E] text-[#0A1E1E] dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#184F53] focus:border-transparent transition-all shadow-sm disabled:opacity-50 font-medium";
const labelClass = "block text-xs font-bold text-[#184F53] dark:text-primary-300 mb-2 uppercase tracking-wide";
const btnPrimary = "px-6 py-3 rounded-full bg-[#CEEC22] hover:bg-[#b5d11b] text-[#0A1E1E] text-sm font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-50";

const roles = ["Étudiant actuel", "Ancien étudiant", "Enseignant"];
const sections = [
  { id: "profil", label: "Informations personnelles", icon: User },
  { id: "securite", label: "Sécurité et connexion", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "affichage", label: "Préférences d'affichage", icon: Palette },
  { id: "confidentialite", label: "Confidentialité et compte", icon: Shield },
] as const;

type SectionId = (typeof sections)[number]["id"];

export default function ParametresPage() {
  const { theme, toggle } = useTheme();
  const [active, setActive] = useState<SectionId>("profil");

  const { data: session } = authClient.useSession();
  const { data } = trpc.profile.get.useQuery();

  const [nom, setNom] = useState(session?.user?.name || "");
  const [image, setImage] = useState(session?.user?.image || "");
  const [role, setRole] = useState(roles[0]);
  const [filiereCode, setFiliereCode] = useState("");
  const [parcours, setParcours] = useState("");
  const [facebook, setFacebook] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  
  const [feedback, setFeedback] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [progress, setProgress] = useState(0);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passFeedback, setPassFeedback] = useState("");

  const utils = trpc.useUtils();

  useEffect(() => {
    if (session?.user) {
      setNom(session.user.name || "");
      setImage(session.user.image || "");
    }
  }, [session]);

  useEffect(() => {
    if (data?.profile) {
      setRole(data.profile.role === "etudiant" ? roles[0] : data.profile.role || roles[0]);
      if (data.filiereCode) setFiliereCode(data.filiereCode);
      else setFiliereCode("");
      setParcours(data.profile.parcours || "");
      setFacebook(data.profile.facebook || "");
      setLinkedin(data.profile.linkedin || "");
      if (data.profile.whatsapp) setWhatsapp(formatWhatsAppInput(data.profile.whatsapp));
    }
  }, [data]);

  useEffect(() => {
    if (isSaving) {
      setProgress(0);
      const t = setTimeout(() => setProgress(90), 50);
      return () => clearTimeout(t);
    }
    setProgress(0);
  }, [isSaving]);

  const updateProfile = trpc.profile.update.useMutation({
    onSuccess: () => {
      setFeedback("Profil mis à jour avec succès !");
      utils.profile.get.invalidate();
      setTimeout(() => setFeedback(""), 3000);
    },
    onError: (err) => setFeedback(err.message || "Une erreur est survenue."),
    onSettled: () => setIsSaving(false),
  });

  const onPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500 * 1024) return setFeedback("L'image ne doit pas dépasser 500 Ko.");
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback("");
    setIsSaving(true);
    const finalWhatsapp = whatsapp ? `+261${formatWhatsAppInput(whatsapp)}` : undefined;
    try {
      await authClient.updateUser({ name: nom, image: image || undefined });
      updateProfile.mutate({
        role: role === roles[0] ? "etudiant" : role,
        filiereCode: filiereCode || null,
        parcours, facebook, linkedin, whatsapp: finalWhatsapp,
      });
    } catch (err) {
      setFeedback("Erreur lors de la mise à jour.");
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassFeedback("");
    if (newPassword !== confirmPassword) return setPassFeedback("Les mots de passe ne correspondent pas.");
    if (newPassword.length < 8) return setPassFeedback("Le mot de passe doit contenir au moins 8 caractères.");
    try {
      const { error } = await authClient.changePassword({ currentPassword, newPassword, revokeOtherSessions: true });
      if (error) setPassFeedback(error.message || "Erreur.");
      else {
        setPassFeedback("Mot de passe modifié avec succès !");
        setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      }
    } catch (err) { setPassFeedback("Une erreur inattendue est survenue."); }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] dark:bg-[#051414] p-4 md:p-8">
      {isSaving && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0A1E1E]/40 backdrop-blur-sm p-4">
          <div className="w-96 max-w-full rounded-3xl bg-white dark:bg-[#0A1E1E] p-8 shadow-2xl border border-neutral-200 dark:border-neutral-800">
            <div className="flex flex-col items-center">
              <div className="relative w-16 h-16 mb-5">
                <div className="absolute inset-0 rounded-full border-4 border-[#CEEC22]/20" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#CEEC22] animate-spin" />
              </div>
              <h3 className="text-lg font-bold text-[#0A1E1E] dark:text-white mb-1">Enregistrement en cours</h3>
              <div className="w-full h-1.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-[#051414]">
                <div style={{ width: `${progress}%` }} className="h-full rounded-full bg-[#CEEC22] transition-all duration-[3000ms] ease-out" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0A1E1E] dark:text-white font-heading">Paramètres</h1>
          <p className="text-neutral-500 mt-1">Gérez votre profil et vos préférences.</p>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-6 items-start">
          <aside className="bg-white dark:bg-[#0A1E1E] rounded-[2rem] shadow-sm overflow-hidden p-4 border border-neutral-100 dark:border-neutral-800 sticky top-8">
            <div className="text-center pb-6 pt-4 border-b border-neutral-100 dark:border-neutral-800 mb-4">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <Image src={image || "/images/authors/authors1.jpg"} alt={nom || "Profil"} fill sizes="96px" className="rounded-full object-cover border-4 border-[#F4F5F7] dark:border-neutral-800" />
              </div>
              <p className="font-bold text-lg text-[#0A1E1E] dark:text-white truncate px-2">{nom}</p>
              <p className="text-xs font-medium text-neutral-500 mt-0.5">{role}</p>
            </div>

            <nav className="space-y-1">
              {sections.map((s) => {
                const Icon = s.icon;
                const isActive = active === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActive(s.id)}
                    className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-full text-sm font-bold transition-all duration-200 ${
                      isActive ? "bg-[#CEEC22] text-[#0A1E1E] shadow-md" : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-[#0A1E1E] dark:hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {s.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          <section className="bg-white dark:bg-[#0A1E1E] rounded-[2rem] shadow-sm p-6 md:p-10 border border-neutral-100 dark:border-neutral-800 min-h-[600px]">
            
            {active === "profil" && (
              <div className="animate-in fade-in duration-300">
                <header className="mb-8">
                  <h2 className="text-2xl font-bold text-[#0A1E1E] dark:text-white">Informations personnelles</h2>
                  <p className="text-sm text-neutral-500 mt-1">Mettez à jour vos informations publiques.</p>
                </header>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="flex items-center gap-6 p-4 rounded-2xl bg-[#F4F5F7] dark:bg-[#051414] border border-neutral-100 dark:border-neutral-800">
                    <div className="relative w-20 h-20 shrink-0">
                      <Image src={image || "/images/authors/authors1.jpg"} alt={nom} fill sizes="80px" className="rounded-full object-cover border-2 border-white dark:border-neutral-700 shadow-sm" />
                    </div>
                    <label className="cursor-pointer text-sm font-bold text-[#184F53] dark:text-[#CEEC22] bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-full px-5 py-2.5 hover:border-[#184F53] transition-colors flex items-center gap-2 shadow-sm">
                      <Upload className="w-4 h-4" /> Changer la photo
                      <input type="file" accept="image/*" onChange={onPhotoChange} className="hidden" />
                    </label>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>Nom et prénom</label>
                      <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} className={inputClass} disabled={isSaving} />
                    </div>
                    <div>
                      <label className={labelClass}>Adresse e-mail</label>
                      <input type="email" value={session?.user?.email || ""} readOnly className={inputClass + " opacity-60 cursor-not-allowed"} />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>Filière</label>
                      <div className="relative">
                        <select value={filiereCode} onChange={(e) => setFiliereCode(e.target.value)} className={selectClass} disabled={isSaving}>
                          <option value="">Sélectionner…</option>
                          {filieres.map((f) => <option key={f.id} value={f.code}>{f.code} — {f.name}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Parcours</label>
                      <input type="text" value={parcours} onChange={(e) => setParcours(e.target.value)} placeholder="Ex : STI" className={inputClass} disabled={isSaving} />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Statut</label>
                    <div className="relative">
                      <select value={role} onChange={(e) => setRole(e.target.value)} className={selectClass} disabled={isSaving}>
                        {roles.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
                    <label className={labelClass}>Contacts publics (facultatif)</label>
                    <div className="space-y-3 mt-3">
                      <div className="relative">
                        <FacebookIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1877F2]" />
                        <input type="text" value={facebook} onChange={(e) => setFacebook(e.target.value)} placeholder="Lien vers votre profil Facebook" className={iconInputClass} disabled={isSaving} />
                      </div>
                      <div className="relative">
                        <LinkedinIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0A66C2]" />
                        <input type="text" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="Lien vers votre profil LinkedIn" className={iconInputClass} disabled={isSaving} />
                      </div>
                      <div className="relative">
                        <WhatsappIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#25D366]" />
                        <span className="absolute left-11 top-1/2 -translate-y-1/2 text-sm text-neutral-500 font-bold">+261</span>
                        <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(formatWhatsAppInput(e.target.value))} placeholder="-- -- --- --" className="w-full pl-[6rem] pr-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-[#F4F5F7] dark:bg-[#0A1E1E] text-[#0A1E1E] dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#184F53] focus:border-transparent transition-all shadow-sm disabled:opacity-50 font-medium" disabled={isSaving} />
                      </div>
                    </div>
                  </div>

                  {feedback && <p className={`text-sm text-center font-bold p-3 rounded-xl ${feedback.includes("succès") ? "text-green-700 bg-green-50" : "text-red-600 bg-red-50"}`}>{feedback}</p>}

                  <div className="flex justify-end pt-4">
                    <button type="submit" disabled={isSaving} className={btnPrimary}>{isSaving ? "Enregistrement…" : "Enregistrer les modifications"}</button>
                  </div>
                </form>
              </div>
            )}

            {active === "securite" && (
              <div className="animate-in fade-in duration-300">
                <header className="mb-8">
                  <h2 className="text-2xl font-bold text-[#0A1E1E] dark:text-white">Sécurité et connexion</h2>
                  <p className="text-sm text-neutral-500 mt-1">Gérez votre mot de passe et vos sessions.</p>
                </header>
                <div className="space-y-8">
                  <div>
                    <label className={labelClass}>Adresse e-mail du compte</label>
                    <input type="email" value={session?.user?.email || ""} readOnly className={inputClass + " opacity-60 cursor-not-allowed"} />
                  </div>
                  <form onSubmit={handlePasswordChange} className="space-y-4 bg-[#F4F5F7] dark:bg-[#051414] p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                    <h3 className="font-bold text-[#0A1E1E] dark:text-white mb-2">Modifier le mot de passe</h3>
                    <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Mot de passe actuel" className={inputClass} required />
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Nouveau mot de passe" className={inputClass} required />
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirmer le nouveau mot de passe" className={inputClass} required />
                    {passFeedback && <p className={`text-sm font-bold ${passFeedback.includes("succès") ? "text-green-600" : "text-red-500"}`}>{passFeedback}</p>}
                    <div className="pt-2">
                      <button type="submit" className={btnPrimary}>Mettre à jour le mot de passe</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {active === "notifications" && (
              <div className="animate-in fade-in duration-300">
                <header className="mb-8">
                  <h2 className="text-2xl font-bold text-[#0A1E1E] dark:text-white">Notifications</h2>
                  <p className="text-sm text-neutral-500 mt-1">Choisissez ce que vous souhaitez recevoir.</p>
                </header>
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-5 rounded-2xl bg-[#F4F5F7] dark:bg-[#051414] border border-transparent hover:border-[#184F53] transition-colors cursor-pointer">
                    <div>
                      <p className="font-bold text-[#0A1E1E] dark:text-white text-sm">Actualités de MemoRise</p>
                      <p className="text-xs text-neutral-500">Recevoir les dernières nouvelles de la plateforme.</p>
                    </div>
                    <input type="checkbox" checked={data?.profile?.notifyNews ?? true} onChange={(e) => updateProfile.mutate({ notifyNews: e.target.checked, notifyPublications: data?.profile?.notifyPublications ?? true })} className="w-6 h-6 accent-[#CEEC22] cursor-pointer" />
                  </label>
                  <label className="flex items-center justify-between p-5 rounded-2xl bg-[#F4F5F7] dark:bg-[#051414] border border-transparent hover:border-[#184F53] transition-colors cursor-pointer">
                    <div>
                      <p className="font-bold text-[#0A1E1E] dark:text-white text-sm">Mes publications</p>
                      <p className="text-xs text-neutral-500">Être notifié quand quelqu'un consulte ou contacte pour mes mémoires.</p>
                    </div>
                    <input type="checkbox" checked={data?.profile?.notifyPublications ?? true} onChange={(e) => updateProfile.mutate({ notifyPublications: e.target.checked, notifyNews: data?.profile?.notifyNews ?? true })} className="w-6 h-6 accent-[#CEEC22] cursor-pointer" />
                  </label>
                </div>
              </div>
            )}

            {active === "affichage" && (
              <div className="animate-in fade-in duration-300">
                <header className="mb-8">
                  <h2 className="text-2xl font-bold text-[#0A1E1E] dark:text-white">Préférences d'affichage</h2>
                  <p className="text-sm text-neutral-500 mt-1">Personnalisez l'apparence de l'application.</p>
                </header>
                <div className="flex items-center justify-between p-6 rounded-2xl bg-[#F4F5F7] dark:bg-[#051414] border border-neutral-100 dark:border-neutral-800">
                  <div>
                    <p className="font-bold text-[#0A1E1E] dark:text-white">Thème de l'application</p>
                    <p className="text-sm text-neutral-500">Mode {theme === "dark" ? "sombre" : "clair"} activé.</p>
                  </div>
                  <button onClick={toggle} aria-label="Changer de thème" className="p-4 rounded-full bg-white dark:bg-neutral-800 text-[#184F53] dark:text-[#CEEC22] shadow-sm hover:scale-105 transition-transform">
                    {theme === "light" ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
                  </button>
                </div>
              </div>
            )}

            {active === "confidentialite" && (
              <div className="animate-in fade-in duration-300">
                <header className="mb-8">
                  <h2 className="text-2xl font-bold text-[#0A1E1E] dark:text-white">Confidentialité et compte</h2>
                  <p className="text-sm text-neutral-500 mt-1">Gérez vos données personnelles.</p>
                </header>
                
                {/* 👇 LIENS DE CONFIDENTIALITÉ RESTAURÉS */}
                <div className="space-y-3">
                  <Link href="/confidentialite" className="flex items-center justify-between p-5 rounded-2xl bg-[#F4F5F7] dark:bg-[#051414] border border-transparent hover:border-[#184F53] transition-colors group">
                    <span className="font-bold text-[#0A1E1E] dark:text-white">Politique de confidentialité</span>
                    <span className="text-neutral-400 group-hover:text-[#184F53]">&rarr;</span>
                  </Link>
                  <Link href="/conditions" className="flex items-center justify-between p-5 rounded-2xl bg-[#F4F5F7] dark:bg-[#051414] border border-transparent hover:border-[#184F53] transition-colors group">
                    <span className="font-bold text-[#0A1E1E] dark:text-white">Conditions d'utilisation</span>
                    <span className="text-neutral-400 group-hover:text-[#184F53]">&rarr;</span>
                  </Link>
                </div>

                <div className="mt-12 pt-8 border-t border-red-100 dark:border-red-900/30">
                  <h3 className="text-lg font-bold text-red-600 mb-2">Zone de danger</h3>
                  <p className="text-sm text-neutral-500 mb-4">La suppression du compte est définitive. Vos publications et favoris seront perdus.</p>
                  <button type="button" className="px-6 py-3 rounded-full border-2 border-red-500 text-red-500 text-sm font-bold hover:bg-red-500 hover:text-white transition-colors">
                    Supprimer mon compte
                  </button>
                </div>
              </div>
            )}
            
          </section>
        </div>
      </div>
    </div>
  );
}