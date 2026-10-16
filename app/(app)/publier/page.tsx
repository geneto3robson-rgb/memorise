"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Info, Upload } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { filieres } from "@/lib/data/filieres";
import { domainesParFiliere } from "@/lib/data/domaines";
import { trpc } from "@/trpc/client";
import { authClient } from "@/lib/auth-client";

const MAX_WORDS = 500;

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-primary-900 text-primary-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-cta-500 focus:border-cta-500 transition-colors shadow-sm";
const labelClass = "block text-sm font-medium text-primary-900 dark:text-white mb-2";

export default function PublierPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [filiereCode, setFiliereCode] = useState("");
  const [domaine, setDomaine] = useState("");
  const [niveau, setNiveau] = useState("L3");
  const [year, setYear] = useState(2026);
  const [encadreur, setEncadreur] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");

  const wordCount = summary.trim().split(/\s+/).filter(Boolean).length;
  const domainesDisponibles = filiereCode ? (domainesParFiliere[filiereCode] ?? []) : [];

  const createMutation = trpc.memoire.create.useMutation({
    onSuccess: () => {
      router.push("/publication");
    },
    onError: (err) => {
      setFeedback(err.message || "Erreur lors de la publication.");
    },
  });

  const addKeyword = () => {
    const k = keywordInput.trim();
    if (k && !keywords.includes(k)) {
      setKeywords([...keywords, k]);
      setKeywordInput("");
    }
  };

  const onPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPhoto(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback("");
    if (!title || !summary || !filiereCode || !encadreur) {
      setFeedback("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    if (wordCount > MAX_WORDS) {
      setFeedback(`La description dépasse ${MAX_WORDS} mots.`);
      return;
    }
    createMutation.mutate({
      title,
      summary,
      filiereCode,
      domaine,
      niveau,
      annee: year,
      encadreur,
      keywords,
    });
  };

  if (isPending) {
    return (
      <Container className="py-20 text-center text-neutral-500">
        Chargement…
      </Container>
    );
  }

  if (!session) {
    return (
      <Container className="py-20 text-center">
        <h1 className="text-2xl font-bold text-primary-900 dark:text-white font-heading mb-3">
          Connexion requise
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          Vous devez être connecté pour publier un mémoire.
        </p>
        <Link
          href="/connexion"
          className="inline-block px-5 py-2 rounded-full bg-cta-500 hover:bg-cta-400 text-primary-900 text-sm font-semibold"
        >
          Se connecter
        </Link>
      </Container>
    );
  }

  const loading = createMutation.isPending;

  return (
    <Container className="py-10 md:py-14">
      <div className="w-16 h-1 bg-cta-500 mb-4 rounded-full" />
      <h1 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-white font-heading mb-3">
        Publier un mémoire
      </h1>
      <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mb-6">
        Renseignez les informations descriptives. Le PDF complet n&apos;est pas stocké.
      </p>

      <div className="flex items-start gap-3 rounded-2xl border border-cta-500/30 bg-cta-50 dark:bg-primary-900 p-4 mb-8 max-w-3xl">
        <Info className="w-5 h-5 text-cta-600 shrink-0 mt-0.5" />
        <p className="text-sm text-primary-900 dark:text-white">
          La conservation des documents reste assurée par la BAU.
        </p>
      </div>

      <form className="max-w-3xl space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className={labelClass}>Photo de couverture</label>
          <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl p-6 cursor-pointer hover:border-cta-500 transition-colors">
            {photo ? (
              <img src={photo} alt="Aperçu" className="w-full max-h-48 object-cover rounded-lg" />
            ) : (
              <>
                <Upload className="w-6 h-6 text-neutral-400" />
                <span className="text-sm text-neutral-500">Cliquez pour choisir une image</span>
              </>
            )}
            <input type="file" accept="image/*" onChange={onPhotoChange} className="hidden" />
          </label>
        </div>

        <div>
          <label className={labelClass}>Titre du mémoire *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            className={inputClass}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Filière *</label>
            <select
              value={filiereCode}
              onChange={(e) => {
                setFiliereCode(e.target.value);
                setDomaine("");
              }}
              disabled={loading}
              className={inputClass}
            >
              <option value="">Sélectionner…</option>
              {filieres.map((f) => (
                <option key={f.id} value={f.code}>{f.code} — {f.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Domaine</label>
            <select
              value={domaine}
              onChange={(e) => setDomaine(e.target.value)}
              disabled={loading || !filiereCode || domainesDisponibles.length === 0}
              className={inputClass}
            >
              <option value="">
                {!filiereCode
                  ? "Choisir une filière d'abord"
                  : domainesDisponibles.length === 0
                  ? "Aucun domaine disponible"
                  : "Sélectionner…"}
              </option>
              {domainesDisponibles.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Niveau *</label>
            <select
              value={niveau}
              onChange={(e) => setNiveau(e.target.value)}
              disabled={loading}
              className={inputClass}
            >
              <option value="L3">L3</option>
              <option value="M2">M2</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Année de soutenance *</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              disabled={loading}
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass}>Encadreur *</label>
            <input
              type="text"
              value={encadreur}
              onChange={(e) => setEncadreur(e.target.value)}
              disabled={loading}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Description * (max {MAX_WORDS} mots)</label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            disabled={loading}
            rows={5}
            className={inputClass}
          />
          <p className="text-xs text-neutral-500 mt-1">{wordCount} / {MAX_WORDS} mots</p>
        </div>

        <div>
          <label className={labelClass}>Mots-clés</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {keywords.map((k) => (
              <span key={k} className="px-3 py-1 rounded-full bg-primary-900 text-white text-xs">
                {k}
              </span>
            ))}
          </div>
          <input
            type="text"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); addKeyword(); }
            }}
            disabled={loading}
            placeholder="Tapez un mot-clé puis Entrée"
            className={inputClass}
          />
        </div>

        {feedback && (
          <p className="text-sm text-error-500 text-center">{feedback}</p>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-cta-500 hover:bg-cta-400 disabled:opacity-60 disabled:cursor-not-allowed text-primary-900 font-semibold rounded-full px-8 py-3"
          >
            {loading ? "Publication…" : "Publier le mémoire"}
          </button>
        </div>
      </form>
    </Container>
  );
}