"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { ProjectCard } from "@/components/landing/ProjectCard";
import { projects } from "@/lib/data/projects";
import { filieres } from "@/lib/data/filieres";

const PER_PAGE = 12;
const niveaux = ["L3", "M2"];
const annees = [2026, 2025, 2024, 2023, 2022];
const CURRENT_YEAR = new Date().getFullYear();

export default function ExplorerPage() {
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [filiereCode, setFiliereCode] = useState(searchParams.get("filiere") ?? "");
  const [niveau, setNiveau] = useState("");
  const [annee, setAnnee] = useState<number | "">("");
  const [showCustomYear, setShowCustomYear] = useState(false);
  const [sort, setSort] = useState("pertinence");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [search, filiereCode, niveau, annee, sort]);

  const filtered = projects.filter((p) => {
    const q = search.toLowerCase().trim();
    const matchSearch =
      q === "" ||
      p.title.toLowerCase().includes(q) ||
      p.author.toLowerCase().includes(q) ||
      p.keywords.some((k) => k.toLowerCase().includes(q));
    const matchFiliere = filiereCode === "" || p.filiereCode === filiereCode;
    const matchNiveau = niveau === "" || p.niveau === niveau;
    const matchAnnee = annee === "" || p.year === annee;
    return matchSearch && matchFiliere && matchNiveau && matchAnnee;
  });

  const sorted = [...filtered];
  if (sort === "recent") sorted.sort((a, b) => b.year - a.year);
  else if (sort === "ancien") sorted.sort((a, b) => a.year - b.year);
  else if (sort === "titre") sorted.sort((a, b) => a.title.localeCompare(b.title));
  else if (sort === "auteur") sorted.sort((a, b) => a.author.localeCompare(b.author));

  const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = sorted.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const resetFilters = () => {
    setSearch("");
    setFiliereCode("");
    setNiveau("");
    setAnnee("");
    setShowCustomYear(false);
    setSort("pertinence");
    setPage(1);
  };

  const handleYearInput = (raw: string) => {
    if (raw === "") {
      setAnnee("");
      return;
    }
    const n = Number(raw);
    if (Number.isInteger(n) && n > 0) {
      setAnnee(n);
    }
  };

  return (
    <div>
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

      <Container className="py-8 md:py-12">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-primary-900 text-sm text-primary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cta-500"
          >
            <option value="pertinence">Trier par : Pertinence</option>
            <option value="recent">Plus récents</option>
            <option value="ancien">Plus anciens</option>
            <option value="titre">Titre (A → Z)</option>
            <option value="auteur">Auteur (A → Z)</option>
          </select>

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

        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setFiliereCode("")}
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
              onClick={() => setFiliereCode(f.code)}
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

        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
          {sorted.length} mémoire{sorted.length > 1 ? "s" : ""} trouvé
          {sorted.length > 1 ? "s" : ""}
        </p>

        {paginated.length === 0 ? (
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
            {paginated.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-700 text-primary-900 dark:text-white disabled:opacity-40 hover:border-cta-500 transition-colors"
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                  n === currentPage
                    ? "bg-cta-500 text-primary-900"
                    : "border border-neutral-200 dark:border-neutral-700 text-primary-900 dark:text-white hover:border-cta-500"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-700 text-primary-900 dark:text-white disabled:opacity-40 hover:border-cta-500 transition-colors"
            >
              ›
            </button>
          </div>
        )}
      </Container>
    </div>
  );
}