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

const parcoursParFiliere: Record<string, string[]> = {
  TCO: ["STI", "RS", "RC"],
  GE: ["Électrotechnique", "Énergie", "Automatisme"],
  BTP: ["GCG", "Bâtiment", "Hydraulique"],
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

  // ÉCOUTE DES CHANGEMENTS D'URL POUR METTRE A JOUR LES FILTRES
  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    const f = searchParams.get("filiere") ?? "";
    const p = searchParams.get("parcours") ?? "";
    
    setSearch(q);
    setFiliereCode(f);
    setParcours(p);
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
    router.push("/explorer"); // Nettoie l'URL
  };

  const changeFiliere = (code: string) => {
    setFiliereCode(code); setDomaine(""); setParcours("");
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
      {/* ... (Ton UI de recherche inchangé) ... */}
      
      <Container className="py-8 md:py-12">
        <div className="bg-white dark:bg-primary-900 border border-neutral-200 dark:border-neutral-700 rounded-3xl p-5 mb-8 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-primary-900 dark:text-white font-semibold border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <SlidersHorizontal className="w-4 h-4" /> Filtres de recherche
          </div>
          
          <div className="flex flex-wrap items-center gap-4 mb-5">
            {/* ... selects de tri, niveaux, années ... */}
            
            <button onClick={resetFilters} className="text-sm font-medium text-neutral-500 hover:text-error-500 transition-colors ml-auto">Réinitialiser tout</button>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            <button onClick={() => changeFiliere("")} className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${filiereCode === "" ? "bg-primary-900 dark:bg-cta-500 text-white dark:text-primary-900" : "bg-neutral-100 dark:bg-primary-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-primary-700"}`}>Toutes les filières</button>
            {filieres.map((f) => (
              <button key={f.id} onClick={() => changeFiliere(f.code)} className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${filiereCode === f.code ? "bg-primary-900 dark:bg-cta-500 text-white dark:text-primary-900" : "bg-neutral-100 dark:bg-primary-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-primary-700"}`}>{f.code}</button>
            ))}
          </div>

          {(domainesDisponibles.length > 0 || parcoursDisponibles.length > 0) && (
            <div className="space-y-2 mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              {parcoursDisponibles.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide mr-2">Parcours :</span>
                  <button onClick={() => setParcours("")} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${parcours === "" ? "bg-cta-500 text-primary-900" : "border border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:border-cta-500"}`}>Tous</button>
                  {parcoursDisponibles.map((p) => (
                    <button key={p} onClick={() => setParcours(p)} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${parcours === p ? "bg-cta-500 text-primary-900" : "border border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:border-cta-500"}`}>{p}</button>
                  ))}
                </div>
              )}
              {domainesDisponibles.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide mr-2">Domaine :</span>
                  <button onClick={() => setDomaine("")} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${domaine === "" ? "bg-cta-500 text-primary-900" : "border border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:border-cta-500"}`}>Tous</button>
                  {domainesDisponibles.map((d) => (
                    <button key={d} onClick={() => setDomaine(d)} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${domaine === d ? "bg-cta-500 text-primary-900" : "border border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:border-cta-500"}`}>{d}</button>
                  ))}
                </div>
              )}
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
      </Container>

      <MemoireModal slug={selectedSlug} onClose={() => setSelectedSlug(null)} />
    </>
  );
}