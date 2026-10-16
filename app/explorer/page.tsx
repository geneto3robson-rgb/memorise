"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { ProjectCard } from "@/components/landing/ProjectCard";
import { filieres } from "@/lib/data/filieres";
import { trpc } from "@/trpc/client";
import { authClient } from "@/lib/auth-client";
import { domainesParFiliere } from "@/lib/data/domaines";

const niveaux = ["L3", "M2"];
const annees = [2026, 2025, 2024, 2023, 2022];
const CURRENT_YEAR = new Date().getFullYear();

const filiereColorMap: Record<string, string> = {
  TCO: "bg-primary-500",
  EN: "bg-warning-500",
  GE: "bg-success-500",
  BTP: "bg-purple-600",
};

export default function ExplorerPage() {
  const searchParams = useSearchParams();
  const { data: session } = authClient.useSession();
  const isConnected = !!session;

  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [filiereCode, setFiliereCode] = useState(searchParams.get("filiere") ?? "");
  const [niveau, setNiveau] = useState("");
  const [annee, setAnnee] = useState<number | "">("");
  const [showCustomYear, setShowCustomYear] = useState(false);
  const [domaine, setDomaine] = useState("");

  const domainesDisponibles = filiereCode ? (domainesParFiliere[filiereCode] ?? []) : [];

  const { data: memoires = [], isLoading } = trpc.memoire.list.useQuery({
  search,
  filiere: filiereCode,
  domaine,
  niveau,
  annee: typeof annee === "number" ? annee : undefined,
  });
  const resetFilters = () => {
    setSearch("");
    setFiliereCode("");
    setNiveau("");
    setAnnee("");
    setShowCustomYear(false);
    setDomaine("");
  };

  const handleYearInput = (raw: string) => {
    if (raw === "") {
      setAnnee("");
      return;
    }
    const n = Number(raw);
    if (Number.isInteger(n) && n > 0) setAnnee(n);
  };

  const changeFiliere = (code: string) => {
    setFiliereCode(code);
    setDomaine("");
  };

  const formatted = memoires.map((m) => ({
    id: String(m.id),
    slug: m.slug,
    title: m.title,
    summary: m.summary,
    image: m.image ?? "/images/projects/telecom.jpg",
    filiere: m.filiereName ?? "",
    filiereCode: m.filiereCode ?? "",
    filiereColor: filiereColorMap[m.filiereCode ?? ""] ?? "bg-primary-500",
    author: m.authorName ?? "Auteur",
    authorAvatar: m.authorImage ?? "/images/authors/authors1.jpg",
    niveau: m.niveau,
    year: m.annee,
    pages: 0,
    encadreur: m.encadreur,
    keywords: [] as string[],
  }));

  return (
    <>
      {!isConnected ? (
        <section className="relative bg-primary-500 pb-24">
          <div className="relative min-h-[320px] rounded-b-[34px] overflow-hidden">
            <Image
              src="/images/hero-bg.jpg"
              alt="Étudiants à l'ESPA"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 via-primary-900/50 to-primary-900/20" />

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 md:px-8 pt-12 pb-20">
              <div className="w-16 h-1 bg-cta-500 mb-4 rounded-full" />
              <h1 className="text-3xl md:text-5xl font-bold text-white font-heading mb-3">
                Explorer les mémoires
              </h1>
              <p className="text-white/85 max-w-2xl mb-8">
                Parcourez les mémoires de fin d&apos;études réalisés à l&apos;ESPA.
                Recherchez par titre, auteur ou mots-clés.
              </p>

              <div className="relative max-w-2xl">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher un mémoire, une filière ou un auteur…"
                  className="w-full px-6 py-4 pr-16 rounded-full bg-white text-primary-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-cta-500 shadow-2xl"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-cta-500 p-3 rounded-full">
                  <Search className="w-5 h-5 text-primary-900" />
                </span>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-white dark:bg-primary-900 border-b border-neutral-200 dark:border-neutral-800">
          <div className="px-4 sm:px-6 md:px-8 py-6 md:py-8">
            <h1 className="text-2xl md:text-3xl font-bold text-primary-900 dark:text-white font-heading mb-1">
              Explorer les mémoires
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-5">
              Parcourez le catalogue de l&apos;ESPA.
            </p>

            <div className="relative max-w-2xl">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un mémoire, une filière ou un auteur…"
                className="w-full px-5 py-3 pr-14 rounded-full bg-neutral-50 dark:bg-primary-950 border border-neutral-200 dark:border-neutral-700 text-primary-900 dark:text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-cta-500"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-cta-500 p-2 rounded-full">
                <Search className="w-4 h-4 text-primary-900" />
              </span>
            </div>
          </div>
        </section>
      )}

      <Container className="py-8 md:py-12">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <select
            value={niveau}
            onChange={(e) => setNiveau(e.target.value)}
            className="px-4 py-2 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-primary-900 text-sm text-primary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cta-500"
          >
            <option value="">Tous les niveaux</option>
            {niveaux.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>

          {!showCustomYear ? (
            <select
              value={annee}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "") {
                  setAnnee("");
                  setShowCustomYear(false);
                } else if (v === "autre") {
                  setAnnee("");
                  setShowCustomYear(true);
                } else {
                  setAnnee(Number(v));
                  setShowCustomYear(false);
                }
              }}
              className="px-4 py-2 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-primary-900 text-sm text-primary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cta-500"
            >
              <option value="">Toutes les années</option>
              {annees.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
              <option value="autre">Autre année…</option>
            </select>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-cta-500 bg-white dark:bg-primary-900">
              <input
                type="number"
                autoFocus
                min={1900}
                max={CURRENT_YEAR}
                step={1}
                value={annee}
                onChange={(e) => handleYearInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "." || e.key === ",") {
                    e.preventDefault();
                  }
                }}
                placeholder="Ex : 2018"
                className="w-24 bg-transparent text-sm text-primary-900 dark:text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  setAnnee("");
                  setShowCustomYear(false);
                }}
                className="text-xs text-neutral-500 hover:text-error-500"
              >
                ✕
              </button>
            </div>
          )}

          <button
            onClick={resetFilters}
            className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-cta-500 transition-colors ml-auto"
          >
            Réinitialiser
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => changeFiliere("")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filiereCode === ""
                ? "bg-primary-900 dark:bg-cta-500 text-white dark:text-primary-900"
                : "bg-white dark:bg-primary-900 text-primary-900 dark:text-white border border-neutral-200 dark:border-neutral-700 hover:border-cta-500"
            }`}
          >
            Toutes les filières
          </button>
          {filieres.map((f) => (
            <button
              key={f.id}
              onClick={() => changeFiliere(f.code)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filiereCode === f.code
                  ? "bg-primary-900 dark:bg-cta-500 text-white dark:text-primary-900"
                  : "bg-white dark:bg-primary-900 text-primary-900 dark:text-white border border-neutral-200 dark:border-neutral-700 hover:border-cta-500"
              }`}
            >
              {f.code}
            </button>
          ))}
        </div>

        {domainesDisponibles.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <span className="text-sm text-neutral-500 mr-1">Domaine :</span>
            <button
              onClick={() => setDomaine("")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                domaine === ""
                  ? "bg-cta-500 text-primary-900"
                  : "bg-white dark:bg-primary-900 text-primary-900 dark:text-white border border-neutral-200 dark:border-neutral-700 hover:border-cta-500"
              }`}
            >
              Tous
            </button>
            {domainesDisponibles.map((d) => (
              <button
                key={d}
                onClick={() => setDomaine(d)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  domaine === d
                    ? "bg-cta-500 text-primary-900"
                    : "bg-white dark:bg-primary-900 text-primary-900 dark:text-white border border-neutral-200 dark:border-neutral-700 hover:border-cta-500"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        )}

        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
          {formatted.length} mémoire{formatted.length > 1 ? "s" : ""} trouvé
          {formatted.length > 1 ? "s" : ""}
        </p>

        {isLoading ? (
          <p className="text-center text-neutral-500 py-12">Chargement…</p>
        ) : formatted.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 bg-white dark:bg-primary-900 p-12 text-center">
            <h3 className="text-lg font-semibold text-primary-900 dark:text-white mb-2">
              Aucun mémoire trouvé
            </h3>
            <p className="text-neutral-500 dark:text-neutral-400 mb-6">
              Aucun mémoire ne correspond à votre recherche.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={resetFilters}
                className="px-5 py-2 rounded-full border-2 border-primary-900 dark:border-white text-primary-900 dark:text-white text-sm font-medium hover:bg-primary-900 hover:text-white dark:hover:bg-white dark:hover:text-primary-900 transition-colors"
              >
                Réinitialiser les filtres
              </button>
              <Link
                href="/publier"
                className="px-5 py-2 rounded-full bg-cta-500 hover:bg-cta-400 text-primary-900 text-sm font-semibold transition-colors"
              >
                Publier un mémoire
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {formatted.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </Container>
    </>
  );
}