"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { ProjectCard } from "@/components/landing/ProjectCard";
import { MemoireModal } from "@/components/memoire/MemoireModal";
import { filieres } from "@/lib/data/filieres";
import { trpc } from "@/trpc/client";
import { authClient } from "@/lib/auth-client";
import { domainesParFiliere } from "@/lib/data/domaines";

const PER_PAGE = 16;
const niveaux = ["L3", "M2"];
const annees = [2026, 2025, 2024, 2023, 2022];
const CURRENT_YEAR = new Date().getFullYear();

const filiereColorMap: Record<string, string> = {
  TCO: "bg-primary-500", EN: "bg-warning-500", GE: "bg-success-500", BTP: "bg-purple-600",
};

// LISTE COMPLETE DES PARCOURS
const parcoursParFiliere: Record<string, string[]> = {
  IGAT: ["IGF", "GT"],
  GMI: ["GI", "GMD", "STGI", "IM", "MA"],
  GPCI: ["VRM", "BIO", "STGP", "LP"],
  MIN: ["STM", "GEO-ENERGIE", "GLB"],
  GE: ["SERI", "IE", "REER", "MEAI"],
  GPAE: ["TAA", "EE"],
  GGEO: [],
  IPE: ["STP", "PCH", "BEEN"],
  BTP: ["BTP", "Géotechnique"],
  HYDR: ["AEH", "AEP", "AHA"],
  EN: ["EA", "IA"],
  ISA: [],
  UAGC: [],
  MTOH: [],
  SIM: ["MOC", "MCM", "GMAT"],
  // Ajout de TCO si jamais il est encore utilisé
  TCO: ["STI", "RS", "RC"],
};

export default function ExplorerPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const isConnected = !!session;

  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [filiereCode, setFiliereCode] = useState(searchParams.get("filiere") ?? "");
  const [parcours, setParcours] = useState(searchParams.get("parcours") ?? "");
  const [niveau, setNiveau] = useState("");
  const [annee, setAnnee] = useState<number | "">("");
  const [showCustomYear, setShowCustomYear] = useState(false);
  const [domaine, setDomaine] = useState("");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<"recent" | "oldest" | "alphabetical">("recent");

  useEffect(() => {
    setSearch(searchParams.get("q") ?? "");
    setFiliereCode(searchParams.get("filiere") ?? "");
    setParcours(searchParams.get("parcours") ?? "");
    setPage(1);
  }, [searchParams]);

  const domainesDisponibles = filiereCode ? (domainesParFiliere[filiereCode] ?? []) : [];
  const parcoursDisponibles = filiereCode ? (parcoursParFiliere[filiereCode] ?? []) : [];

  const { data: memoires = [], isLoading } = trpc.memoire.list.useQuery({
    search, filiere: filiereCode, domaine, parcours, niveau,
    annee: typeof annee === "number" ? annee : undefined,
  });

  const resetFilters = () => {
    setSearch(""); setFiliereCode(""); setDomaine(""); setParcours("");
    setNiveau(""); setAnnee(""); setSort("recent"); setShowCustomYear(false);
    router.push("/explorer");
  };

  const changeFiliere = (code: string) => {
    setFiliereCode(code); setDomaine(""); setParcours("");
    router.push(`/explorer?filiere=${code}`);
  };

  const handleYearInput = (raw: string) => {
    if (raw === "") { setAnnee(""); return; }
    const n = Number(raw);
    if (Number.isInteger(n) && n > 0) setAnnee(n);
  };

  const formatted = useMemo(() => {
    const mapped = memoires.map((m) => ({
      id: String(m.id), slug: m.slug, title: m.title, summary: m.summary,
      image: m.image ?? "/images/projects/telecom.jpg",
      filiere: m.filiereName ?? "", filiereCode: m.filiereCode ?? "",
      filiereColor: filiereColorMap[m.filiereCode ?? ""] ?? "bg-primary-500",
      author: m.authorName ?? "Auteur", authorAvatar: m.authorImage ?? "/images/authors/authors1.jpg",
      niveau: m.niveau, year: m.annee, pages: 0, encadreur: m.encadreur, keywords: [] as string[],
    }));

    return mapped.sort((a, b) => {
      if (sort === "recent") return Number(b.id) - Number(a.id);
      if (sort === "oldest") return Number(a.id) - Number(b.id);
      if (sort === "alphabetical") return a.title.localeCompare(b.title);
      return 0;
    });
  }, [memoires, sort]);

  const totalPages = Math.max(1, Math.ceil(formatted.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = formatted.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  return (
    <>
      {!isConnected ? (
        <section className="relative">
          <div className="relative min-h-[320px] rounded-b-[34px] overflow-hidden">
            <Image src="/images/hero-bg.jpg" alt="Étudiants à l'ESPA" fill priority sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 via-primary-900/50 to-primary-900/20" />
            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 md:px-8 pt-28 pb-16">
              <div className="w-16 h-1 bg-cta-500 mb-4 rounded-full" />
              <h1 className="text-3xl md:text-5xl font-bold text-white font-heading mb-3">Explorer les mémoires</h1>
              <div className="relative max-w-2xl">
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher par titre ou auteur…" className="w-full px-6 py-4 pr-16 rounded-full bg-white text-primary-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-cta-500 shadow-2xl" />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-cta-500 p-3 rounded-full"><Search className="w-5 h-5 text-primary-900" /></span>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-white dark:bg-primary-900 border-b border-neutral-300 dark:border-neutral-700">
          <div className="px-4 sm:px-6 md:px-8 py-6 md:py-8">
            <h1 className="text-2xl md:text-3xl font-bold text-primary-900 dark:text-white font-heading mb-1">Explorer les mémoires</h1>
            <div className="relative max-w-2xl mt-4">
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher par titre ou auteur…" className="w-full px-5 py-3 pr-14 rounded-full bg-white dark:bg-primary-950 border border-neutral-300 dark:border-neutral-600 text-primary-900 dark:text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-cta-500 shadow-sm" />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-cta-500 p-2 rounded-full"><Search className="w-4 h-4 text-primary-900" /></span>
            </div>
          </div>
        </section>
      )}

      <Container className="py-8 md:py-12">
        <div className="bg-white dark:bg-primary-900 border border-neutral-200 dark:border-neutral-700 rounded-3xl p-5 mb-8 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-primary-900 dark:text-white font-semibold border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <SlidersHorizontal className="w-4 h-4" /> Filtres de recherche
          </div>
          
          <div className="flex flex-wrap items-center gap-4 mb-5">
            <select value={sort} onChange={(e) => setSort(e.target.value as any)} className="pl-4 pr-10 py-2.5 rounded-full border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-primary-950 text-sm text-primary-900 dark:text-white appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_10px_center] bg-[length:1em_1em]">
              <option value="recent">Plus récents</option>
              <option value="oldest">Plus anciens</option>
              <option value="alphabetical">Titre (A-Z)</option>
            </select>

            <select value={niveau} onChange={(e) => setNiveau(e.target.value)} className="pl-4 pr-10 py-2.5 rounded-full border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-primary-950 text-sm text-primary-900 dark:text-white appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_10px_center] bg-[length:1em_1em]">
              <option value="">Tous les niveaux</option>
              {niveaux.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>

            {!showCustomYear ? (
              <select value={annee} onChange={(e) => {
                const v = e.target.value;
                if (v === "") { setAnnee(""); setShowCustomYear(false); }
                else if (v === "autre") { setAnnee(""); setShowCustomYear(true); }
                else { setAnnee(Number(v)); setShowCustomYear(false); }
              }} className="pl-4 pr-10 py-2.5 rounded-full border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-primary-950 text-sm text-primary-900 dark:text-white appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_10px_center] bg-[length:1em_1em]">
                <option value="">Toutes les années</option>
                {annees.map((a) => <option key={a} value={a}>{a}</option>)}
                <option value="autre">Autre année…</option>
              </select>
            ) : (
              <div className="flex items-center gap-2 pl-4 pr-3 py-2 rounded-full border border-cta-500 bg-white dark:bg-primary-950 shadow-sm">
                <input type="number" autoFocus min={1900} max={CURRENT_YEAR} value={annee} onChange={(e) => handleYearInput(e.target.value)} placeholder="2018" className="w-20 bg-transparent text-sm text-primary-900 dark:text-white focus:outline-none" />
                <button onClick={() => { setAnnee(""); setShowCustomYear(false); }} className="text-xs text-neutral-500 hover:text-error-500">✕</button>
              </div>
            )}

            <button onClick={resetFilters} className="text-sm font-medium text-neutral-500 hover:text-error-500 transition-colors ml-auto">Réinitialiser tout</button>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            <button onClick={() => changeFiliere("")} className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${filiereCode === "" ? "bg-primary-900 dark:bg-cta-500 text-white dark:text-primary-900" : "bg-neutral-100 dark:bg-primary-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-primary-700"}`}>Toutes les filières</button>
            {filieres.map((f) => (
              <button key={f.id} onClick={() => changeFiliere(f.code)} className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${filiereCode === f.code ? "bg-primary-900 dark:bg-cta-500 text-white dark:text-primary-900" : "bg-neutral-100 dark:bg-primary-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-primary-700"}`}>{f.code}</button>
            ))}
          </div>

          {filiereCode && (
            <div className="space-y-3 mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide mr-2">Parcours :</span>
                <button onClick={() => setParcours("")} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${parcours === "" ? "bg-cta-500 text-primary-900" : "border border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:border-cta-500"}`}>Tous</button>
                {parcoursDisponibles.map((p) => (
                  <button key={p} onClick={() => setParcours(p)} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${parcours === p ? "bg-cta-500 text-primary-900" : "border border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:border-cta-500"}`}>{p}</button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide mr-2">Domaine :</span>
                <button onClick={() => setDomaine("")} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${domaine === "" ? "bg-cta-500 text-primary-900" : "border border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:border-cta-500"}`}>Tous</button>
                {domainesDisponibles.map((d) => (
                  <button key={d} onClick={() => setDomaine(d)} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${domaine === d ? "bg-cta-500 text-primary-900" : "border border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:border-cta-500"}`}>{d}</button>
                ))}
              </div>
            </div>
          )}
        </div>

        <p className="text-sm font-medium text-neutral-500 mb-6">{formatted.length} mémoire{formatted.length > 1 ? "s" : ""} trouvé{formatted.length > 1 ? "s" : ""}</p>
        
        {isLoading ? (
          <p className="text-center text-neutral-500 py-12">Chargement…</p>
        ) : formatted.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-primary-900/50 p-12 text-center">
            <h3 className="text-lg font-bold text-primary-900 dark:text-white mb-2">Aucun mémoire trouvé</h3>
            <p className="text-neutral-500 mb-6">Essayez de modifier vos critères de recherche.</p>
            <button onClick={resetFilters} className="px-6 py-2.5 rounded-full border-2 border-primary-900 dark:border-white text-primary-900 dark:text-white text-sm font-semibold hover:bg-primary-900 hover:text-white transition-colors">Réinitialiser les filtres</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginated.map((project) => <ProjectCard key={project.id} project={project} onOpen={(slug) => setSelectedSlug(slug)} />)}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button onClick={() => { setPage(currentPage - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }} disabled={currentPage === 1} className="w-9 h-9 flex items-center justify-center rounded-full border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-primary-900 text-primary-900 dark:text-white disabled:opacity-40 hover:border-cta-500 transition-colors shadow-sm">‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button key={n} onClick={() => { setPage(n); window.scrollTo({ top: 0, behavior: "smooth" }); }} className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${n === currentPage ? "bg-cta-500 text-primary-900" : "border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-primary-900 text-primary-900 dark:text-white hover:border-cta-500 shadow-sm"}`}>{n}</button>
            ))}
            <button onClick={() => { setPage(currentPage + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }} disabled={currentPage === totalPages} className="w-9 h-9 flex items-center justify-center rounded-full border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-primary-900 text-primary-900 dark:text-white disabled:opacity-40 hover:border-cta-500 transition-colors shadow-sm">›</button>
          </div>
        )}
      </Container>

      <MemoireModal slug={selectedSlug} onClose={() => setSelectedSlug(null)} />
    </>
  );
}