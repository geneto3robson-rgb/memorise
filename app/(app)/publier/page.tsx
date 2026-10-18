"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Info, Upload, X, Image as ImageIcon } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { filieres } from "@/lib/data/filieres";
import { domainesParFiliere } from "@/lib/data/domaines";
import { trpc } from "@/trpc/client";
import { authClient } from "@/lib/auth-client";

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

const MAX_WORDS = 500;
const MAX_IMAGE_SIZE = 500 * 1024;
const MAX_PUBLICATIONS = 3;

const inputClass =
  "w-full pl-4 pr-10 py-3 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-primary-800/50 text-primary-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-cta-500 disabled:opacity-60 shadow-sm appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_10px_center] bg-[length:1em_1em]";

const textInputClass = inputClass.replace("appearance-none", "").replace(/bg-\[url.*?\]/g, "");

const iconInputClass =
  "w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-primary-800/50 text-primary-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-cta-500 disabled:opacity-60 shadow-sm";

const labelClass = "block text-sm font-medium text-primary-900 dark:text-white mb-2";

export default function PublierPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editSlug = searchParams.get("edit");
  const isEditMode = !!editSlug;

  const { data: session, isPending } = authClient.useSession();

  const { data: mesPublications = [] } = trpc.memoire.mine.useQuery(undefined, { enabled: !!session });
  const { data: myProfile } = trpc.memoire.myProfile.useQuery(undefined, { enabled: !!session });
  const { data: existing } = trpc.memoire.bySlug.useQuery({ slug: editSlug ?? "" }, { enabled: isEditMode });

  const limiteAtteinte = !isEditMode && mesPublications.length >= MAX_PUBLICATIONS;

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [filiereCode, setFiliereCode] = useState("");
  const [domaine, setDomaine] = useState("");
  const [parcours, setParcours] = useState("");
  const [niveau, setNiveau] = useState("L3");
  const [year, setYear] = useState(2026);
  const [encadreur, setEncadreur] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  
  const [facebook, setFacebook] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const [feedback, setFeedback] = useState("");
  const [progress, setProgress] = useState(0);

  const wordCount = summary.trim().split(/\s+/).filter(Boolean).length;
  const domainesDisponibles = filiereCode ? domainesParFiliere[filiereCode] ?? [] : [];

  useEffect(() => {
    if (existing) {
      setTitle(existing.title);
      setSummary(existing.summary);
      setFiliereCode(existing.filiereCode ?? "");
      setDomaine(existing.domaine ?? "");
      setParcours(existing.parcours ?? "");
      setNiveau(existing.niveau);
      setYear(existing.annee);
      setEncadreur(existing.encadreur);
      setKeywords(existing.keywords ?? []);
      setPhoto(existing.image ?? null);
      setFacebook(existing.facebook ?? "");
      setLinkedin(existing.linkedin ?? "");
      if (existing.whatsapp) setWhatsapp(formatWhatsAppInput(existing.whatsapp));
    }
  }, [existing]);

  useEffect(() => {
    if (myProfile && !isEditMode) {
      setParcours(myProfile.parcours ?? "");
      setFacebook(myProfile.facebook ?? "");
      setLinkedin(myProfile.linkedin ?? "");
      if (myProfile.whatsapp) setWhatsapp(formatWhatsAppInput(myProfile.whatsapp));
      
      // 👇 SÉCURITÉ FRONTEND : On force la filière du profil
      if (myProfile.filiereCode) {
        setFiliereCode(myProfile.filiereCode);
      }
    }
  }, [myProfile, isEditMode]);

  const createMutation = trpc.memoire.create.useMutation({
    onSuccess: () => {
      sessionStorage.setItem("flashMessage", JSON.stringify({ text: "Votre publication a bien été publiée avec succès.", link: "/publication", linkText: "Voir la publication" }));
      router.push("/tableau-de-bord");
    },
    onError: (err) => setFeedback(err.message || "Erreur lors de la publication."),
  });

  const updateMutation = trpc.memoire.update.useMutation({
    onSuccess: () => {
      sessionStorage.setItem("flashMessage", JSON.stringify({ text: "Votre publication a bien été modifiée avec succès.", link: "/publication", linkText: "Voir la publication" }));
      router.push("/tableau-de-bord");
    },
    onError: (err) => setFeedback(err.message || "Erreur lors de la modification."),
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (isSubmitting) {
      setProgress(0);
      const t = setTimeout(() => setProgress(90), 50);
      return () => clearTimeout(t);
    }
    setProgress(0);
  }, [isSubmitting]);

  const addKeyword = () => {
    const k = keywordInput.trim();
    if (k && !keywords.includes(k)) { setKeywords([...keywords, k]); setKeywordInput(""); }
  };

  const removeKeyword = (k: string) => setKeywords(keywords.filter((x) => x !== k));

  const onPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_SIZE) return setFeedback("L'image ne doit pas dépasser 500 Ko.");
    const reader = new FileReader();
    reader.onloadend = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback("");

    if (limiteAtteinte) return setFeedback("Vous avez atteint la limite de 3 publications.");
    if (!title || !summary || !filiereCode || !encadreur) return setFeedback("Veuillez remplir tous les champs obligatoires.");
    if (wordCount > MAX_WORDS) return setFeedback(`La description dépasse ${MAX_WORDS} mots.`);

    const finalWhatsapp = whatsapp ? `+261${formatWhatsAppInput(whatsapp)}` : undefined;

    const payload = {
      title, summary, filiereCode, domaine, parcours, niveau, annee: year, encadreur, keywords,
      image: photo ?? undefined,
      facebook: facebook || undefined,
      linkedin: linkedin || undefined,
      whatsapp: finalWhatsapp,
    };

    if (isEditMode && editSlug) updateMutation.mutate({ ...payload, slug: editSlug });
    else createMutation.mutate(payload);
  };

  if (isPending) return <Container className="py-20 text-center text-neutral-500">Chargement…</Container>;

  if (!session) {
    return (
      <Container className="py-20 text-center">
        <h1 className="text-2xl font-bold text-primary-900 dark:text-white font-heading mb-3">Connexion requise</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">Vous devez être connecté pour publier un mémoire.</p>
        <Link href="/connexion" className="inline-block px-5 py-2 rounded-full bg-cta-500 hover:bg-cta-400 text-primary-900 text-sm font-semibold">Se connecter</Link>
      </Container>
    );
  }

  return (
    <>
      {isSubmitting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-96 max-w-full rounded-3xl bg-white dark:bg-primary-900 p-8 shadow-2xl border border-neutral-200 dark:border-neutral-700">
            <div className="flex flex-col items-center">
              <div className="relative w-16 h-16 mb-5">
                <div className="absolute inset-0 rounded-full border-4 border-cta-500/20" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cta-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center"><div className="w-6 h-6 rounded-full bg-cta-500/10" /></div>
              </div>
              <h3 className="text-lg font-bold text-primary-900 dark:text-white font-heading mb-1">{isEditMode ? "Modification en cours" : "Publication en cours"}</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 text-center">Veuillez patienter quelques instants…</p>
              <div className="w-full h-1.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-primary-950">
                <div style={{ width: `${progress}%` }} className="h-full rounded-full bg-cta-500 transition-all duration-[3000ms] ease-out" />
              </div>
            </div>
          </div>
        </div>
      )}

      <Container className="py-10 md:py-14">
        <div className="w-16 h-1 bg-cta-500 mb-4 rounded-full" />
        <h1 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-white font-heading mb-8">
          {isEditMode ? "Modifier le mémoire" : "Publier un mémoire"}
        </h1>

        <div className="rounded-3xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-primary-900 p-6 md:p-10 shadow-sm max-w-4xl">
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            {isEditMode ? "Modifiez les informations de votre mémoire." : "Renseignez les informations descriptives. Le PDF complet n'est pas stocké."}
          </p>

          <div className="flex items-start gap-3 rounded-2xl border border-cta-500/30 bg-cta-50 dark:bg-primary-950 p-4 mb-8">
            <Info className="w-5 h-5 text-cta-600 shrink-0 mt-0.5" />
            <p className="text-sm text-primary-900 dark:text-white">La conservation des documents reste assurée par la BAU.</p>
          </div>

          {limiteAtteinte && (
            <div className="mb-6 rounded-2xl border border-error-500/40 bg-error-50 dark:bg-primary-950 p-4">
              <p className="text-sm font-medium text-error-600 dark:text-error-400">
                Vous avez atteint la limite de {MAX_PUBLICATIONS} publications. Supprimez une publication existante pour en créer une nouvelle.
              </p>
              <Link href="/publication" className="inline-block mt-2 text-sm font-semibold text-error-700 dark:text-error-300 hover:underline">Voir mes publications</Link>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className={labelClass}>Photo de couverture</label>
              <label className="group relative flex flex-col items-center justify-center gap-2 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl p-6 cursor-pointer hover:border-cta-500 transition-colors overflow-hidden bg-neutral-50 dark:bg-primary-800/30">
                {photo ? (
                  <>
                    <img src={photo} alt="Aperçu" className="w-full max-h-48 object-cover rounded-lg" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                      <ImageIcon className="w-7 h-7 text-white" />
                      <span className="text-sm font-medium text-white">Modifier la photo de couverture</span>
                    </div>
                  </>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-neutral-400" />
                    <span className="text-sm text-neutral-500">Cliquez pour choisir une image (max 500 Ko)</span>
                  </>
                )}
                <input type="file" accept="image/*" onChange={onPhotoChange} disabled={isSubmitting || limiteAtteinte} className="hidden" />
              </label>
            </div>

            <div>
              <label className={labelClass}>Titre du mémoire *</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} disabled={isSubmitting || limiteAtteinte} className={textInputClass} />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Filière *</label>
                {/* 👇 SÉCURITÉ : Le champ est désactivé si l'utilisateur a une filière */}
                <select 
                  value={filiereCode} 
                  onChange={(e) => { setFiliereCode(e.target.value); setDomaine(""); }} 
                  disabled={isSubmitting || limiteAtteinte || !!myProfile?.filiereCode} 
                  className={inputClass}
                >
                  <option value="">Sélectionner…</option>
                  {filieres.map((f) => <option key={f.id} value={f.code}>{f.code} — {f.name}</option>)}
                </select>
                {myProfile?.filiereCode && (
                  <p className="text-xs text-cta-600 dark:text-cta-400 mt-1 flex items-center gap-1">
                    <Info className="w-3 h-3" /> Filière liée à votre profil
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>Domaine</label>
                <select value={domaine} onChange={(e) => setDomaine(e.target.value)} disabled={isSubmitting || limiteAtteinte || !filiereCode || domainesDisponibles.length === 0} className={inputClass}>
                  <option value="">{!filiereCode ? "Choisir une filière d'abord" : domainesDisponibles.length === 0 ? "Aucun domaine disponible" : "Sélectionner…"}</option>
                  {domainesDisponibles.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <label className={labelClass}>Parcours *</label>
                <input 
                  type="text" value={parcours} onChange={(e) => setParcours(e.target.value)} 
                  onFocus={() => { if (!parcours && myProfile?.parcours) setParcours(myProfile.parcours); }}
                  disabled={isSubmitting || limiteAtteinte} 
                  placeholder={myProfile?.parcours ? "Cliquez pour utiliser le profil" : "Ex: STI, RS, RC…"} 
                  className={textInputClass} 
                />
              </div>

              <div>
                <label className={labelClass}>Niveau *</label>
                <select value={niveau} onChange={(e) => setNiveau(e.target.value)} disabled={isSubmitting || limiteAtteinte} className={inputClass}>
                  <option value="L3">L3</option>
                  <option value="M2">M2</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Année de soutenance *</label>
                <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} disabled={isSubmitting || limiteAtteinte} className={textInputClass} />
              </div>

              <div>
                <label className={labelClass}>Encadreur *</label>
                <input type="text" value={encadreur} onChange={(e) => setEncadreur(e.target.value)} disabled={isSubmitting || limiteAtteinte} className={textInputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Description * (max {MAX_WORDS} mots)</label>
              <textarea value={summary} onChange={(e) => setSummary(e.target.value)} disabled={isSubmitting || limiteAtteinte} rows={5} className={textInputClass} />
              <p className="text-xs text-neutral-500 mt-1">{wordCount} / {MAX_WORDS} mots</p>
            </div>

            <div>
              <label className={labelClass}>Mots-clés</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {keywords.map((k) => (
                  <span key={k} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-900 text-white text-xs">
                    {k}
                    <button type="button" onClick={() => removeKeyword(k)} className="opacity-70 hover:opacity-100"><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
              <input type="text" value={keywordInput} onChange={(e) => setKeywordInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addKeyword(); } }} disabled={isSubmitting || limiteAtteinte} placeholder="Tapez un mot-clé puis Entrée" className={textInputClass} />
            </div>

            <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
              <h3 className="text-lg font-semibold text-primary-900 dark:text-white mb-4">Contacts de l'auteur (facultatif et optionnel)</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="relative">
                  <FacebookIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1877F2]" />
                  <input type="text" value={facebook} onChange={(e) => setFacebook(e.target.value)} onFocus={() => { if (!facebook && myProfile?.facebook) setFacebook(myProfile.facebook); }} disabled={isSubmitting || limiteAtteinte} placeholder={myProfile?.facebook ? "Utiliser le profil" : "Lien Facebook"} className={iconInputClass} />
                </div>
                <div className="relative">
                  <LinkedinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0A66C2]" />
                  <input type="text" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} onFocus={() => { if (!linkedin && myProfile?.linkedin) setLinkedin(myProfile.linkedin); }} disabled={isSubmitting || limiteAtteinte} placeholder={myProfile?.linkedin ? "Utiliser le profil" : "Lien LinkedIn"} className={iconInputClass} />
                </div>
                <div className="relative">
                  <WhatsappIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#25D366]" />
                  <span className="absolute left-10 top-1/2 -translate-y-1/2 text-sm text-neutral-500 font-medium">+261</span>
                  <input 
                    type="text" 
                    value={whatsapp} 
                    onChange={(e) => setWhatsapp(formatWhatsAppInput(e.target.value))} 
                    onFocus={() => { if (!whatsapp && myProfile?.whatsapp) setWhatsapp(formatWhatsAppInput(myProfile.whatsapp)); }} 
                    disabled={isSubmitting || limiteAtteinte} 
                    placeholder={myProfile?.whatsapp ? "Utiliser le profil" : "34 78 805 02"} 
                    className="w-full pl-[5.5rem] pr-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-primary-800/50 text-primary-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-cta-500 disabled:opacity-60 shadow-sm" 
                  />
                </div>
              </div>
            </div>

            {feedback && <p className="text-sm text-error-500 text-center font-medium bg-error-50 dark:bg-error-900/20 py-2 rounded-lg">{feedback}</p>}

            <div className="flex flex-wrap justify-end gap-3 pt-4">
              <button type="button" onClick={() => router.push(isEditMode ? "/publication" : "/tableau-de-bord")} disabled={isSubmitting} className="inline-flex items-center gap-2 border-2 border-neutral-300 dark:border-neutral-600 text-primary-900 dark:text-white font-semibold rounded-full px-6 py-3 hover:border-cta-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors">
                <X className="w-4 h-4" /> Annuler
              </button>
              <button type="submit" disabled={isSubmitting || limiteAtteinte} className="bg-cta-500 hover:bg-cta-400 disabled:bg-neutral-300 dark:disabled:bg-primary-800 disabled:text-neutral-500 dark:disabled:text-neutral-500 disabled:cursor-not-allowed text-primary-900 font-semibold rounded-full px-8 py-3 transition-colors">
                {isSubmitting ? (isEditMode ? "Modification…" : "Publication…") : limiteAtteinte ? "Limite atteinte (3 max)" : isEditMode ? "Enregistrer les modifications" : "Publier le mémoire"}
              </button>
            </div>
          </form>
        </div>
      </Container>
    </>
  );
}