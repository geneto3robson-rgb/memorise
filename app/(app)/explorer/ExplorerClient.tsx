"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
// 👇 Ajout de ChevronLeft et ChevronRight pour la pagination
import { SlidersHorizontal, ChevronDown, Search, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"; 
import { Container } from "@/components/layout/Container";
import { ProjectCard } from "@/components/landing/ProjectCard";
import { MemoireModal } from "@/components/memoire/MemoireModal";
import { filieres } from "@/lib/data/filieres";
import { trpc } from "@/trpc/client";
import { domainesParFiliere } from "@/lib/data/domaines";
import { authClient } from "@/lib/auth-client";

const PER_PAGE = 16;
const niveaux = ["L3", "M2"];
const annees = [2026, 2025, 2024, 2023, 2022];

const filiereColorMap: Record<string, string> = {
  TCO: "bg-primary-500", EN: "bg-warning-500", GE: "bg-success-500", BTP: "bg-purple-600",
};

const parcoursParFiliere: Record<string, string[]> = {
  IGAT: ["IGF", "GT"], GMI: ["GI", "GMD", "STGI", "IM", "MA"], GPCI: ["VRM", "BIO", "STGP", "LP"],
  IMIN: ["STM", "GEO-ENERGIE", "GLB"], GE: ["SERI", "IE", "REER", "MEAI"], GPAE: ["TAA", "EE"],
  GGEO: ["GEA", "GM", "GSS"], IPE: ["STP", "PCH", "BEEN"], BTP: ["BTP", "Géotechnique"],
  HYDR: ["AEH", "AEP", "AHA"], EN: ["EA", "IA"], ISA: [], UAGC: [],
  MTO: ["Science de l'Atmosphère", "Météorologie Appliquée", "Hydrologie"], SIM: ["MOC", "MCM", "GMAT"], TCO: ["STI", "RS", "RC"],
};

const filterInputClass = "h-10 pl-4 pr-10 bg-neutral-50 dark:bg-primary-800 border border-neutral-200 dark:border-neutral-700 rounded-full text-sm font-medium text-primary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cta-500 appearance-none w-full";

export default function ExplorerClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = authClient.useSession();
  
  const initialFiliere = searchParams.get("filiere") ?? "";
  const initialParcours = searchParams.get("parcours") ?? "";

  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [filiereCode, setFiliereCode] = useState(initialFiliere);
  const [parcours, setParcours] = useState(initialParcours);
  
  const [niveau, setNiveau] = useState("");
  const [annee, setAnnee] = useState<number | "">("");
  const [showCustomYear, setShowCustomYear] = useState(false);
  const [domaine, setDomaine] = useState("");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<"recent" | "oldest" | "alphabetical">("recent");

  useEffect(() => {
    const urlFiliere = searchParams.get("filiere") ?? "";
    const urlParcours = searchParams.get("parcours") ?? "";
    if (urlFiliere !== filiereCode) setFiliereCode(urlFiliere);
    if (urlParcours !== parcours) setParcours(urlParcours);
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
    router.push(pathname);
  };

  const changeFiliere = (code: string) => {
    setFiliereCode(code); setDomaine(""); setParcours("");
    const params = new URLSearchParams(searchParams.toString());
    if (code) params.set("filiere", code); else params.delete("filiere");
    params.delete("parcours"); 
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const changeParcours = (p: string) => {
    setParcours(p);
    const params = new URLSearchParams(searchParams.toString());
    if (p) params.set("parcours", p); else params.delete("parcours");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "custom") { setShowCustomYear(true); setAnnee(""); } 
    else { setShowCustomYear(false); setAnnee(val ? Number(val) : ""); }
  };

  const formatted = useMemo(() => {
    const mapped = memoires.map((m) => ({
      id: String(m.id), slug: m.slug, title: m.title, summary: m.summary,
      image: m.image ?? "/images/projects/telecom.jpg",
      filiere: m.filiereName ?? "", filiereCode: m.filiereCode ?? "",
      filiereColor: filiereColorMap[m.filiereCode ?? ""] ?? "bg-primary-500",
      author: m.authorName ?? "Auteur", authorImage: m.authorImage ?? "/images/authors/authors1.jpg", authorAvatar: m.authorImage ?? "/images/authors/authors1.jpg",
      niveau: m.niveau, year: m.annee, pages: 0, encadreur: m.encadreur, keywords: [] as string[],
    }));

    return mapped.sort((a, b) => {
      if (sort === "recent") return b.year - a.year;
      if (sort === "oldest") return a.year - b.year;
      if (sort === "alphabetical") return a.title.localeCompare(b.title);
      return 0;
    });
  }, [memoires, sort]);

  const totalPages = Math.max(1, Math.ceil(formatted.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = formatted.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  return (
    <>
      {!session && (
        <section className="relative min-h-[400px] flex items-center pt-24">
          <Image src="/images/hero-bg.jpg" alt="Étudiant consultant un mémoire" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-primary-950/60" />
          
          <Container className="relative z-10 py-16">
            <div className="max-w-2xl">
              
              {/* 👇 FLÈCHE DE RETOUR SIMPLE */}
              <Link 
                href="/" 
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm mb-6 transition-colors"
                title="Retour à l'accueil"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>

              <h1 className="text-4xl md:text-5xl font-bold text-white font-heading mb-4">
                Explorer les mémoires
              </h1>
              <p className="text-lg text-white/90 mb-8">
                Parcourez le catalogue des travaux de fin d'études de l'ESPA et trouvez l'inspiration pour votre propre projet.
              </p>
              
              <div className="relative">
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un mémoire, un auteur..." className="w-full px-6 py-4 pr-14 rounded-full bg-white text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-cta-500 shadow-xl text-lg" />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-cta-500 p-3 rounded-full">
                  <Search className="w-5 h-5 text-primary-900" />
                </div>
              </div>
            </div>
          </Container>
        </section>
      )}

      <main className={`pb-16 bg-[#f7faf9] dark:bg-primary-950 min-h-screen relative z-20 ${!session ? 'pt-8' : 'pt-24'}`}>
        <Container>
          {session && (
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-white font-heading mb-2">Explorer les mémoires</h1>
              <p className="text-primary-700 dark:text-neutral-400">Parcourez le catalogue des travaux de fin d'études de l'ESPA.</p>
            </div>
          )}

          {session && (
            <div className="relative max-w-2xl mb-6">
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un mémoire, un auteur..." className="w-full h-12 pl-12 pr-4 bg-white dark:bg-primary-900 border border-neutral-200 dark:border-neutral-700 rounded-full text-base text-primary-900 dark:text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-cta-500 shadow-sm" />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-600" />
            </div>
          )}

          <div className="bg-white dark:bg-primary-900 border border-neutral-200 dark:border-neutral-700 rounded-3xl p-5 mb-8 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-primary-900 dark:text-white font-semibold border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <SlidersHorizontal className="w-4 h-4" /> Filtres de recherche
            </div>
            
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <div className="relative min-w-[140px]">
                <select value={sort} onChange={(e) => setSort(e.target.value as any)} className={filterInputClass}>
                  <option value="recent">Plus récents</option>
                  <option value="oldest">Plus anciens</option>
                  <option value="alphabetical">Titre (A-Z)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-600 pointer-events-none" />
              </div>

              <div className="relative min-w-[150px]">
                <select value={niveau} onChange={(e) => setNiveau(e.target.value)} className={filterInputClass}>
                  <option value="">Tous les niveaux</option>
                  {niveaux.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-600 pointer-events-none" />
              </div>

              <div className="flex items-center gap-2">
                <div className="relative min-w-[160px]">
                  <select value={showCustomYear ? "custom" : annee} onChange={handleYearChange} className={filterInputClass}>
                    <option value="">Toutes les années</option>
                    {annees.map(a => <option key={a} value={a}>{a}</option>)}
                    <option value="custom">Autre année...</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-600 pointer-events-none" />
                </div>

                {showCustomYear && (
                  <input type="number" placeholder="Ex: 2021" value={annee || ""} onChange={(e) => setAnnee(e.target.value ? Number(e.target.value) : "")} className="h-10 w-28 pl-4 pr-4 bg-neutral-50 dark:bg-primary-800 border border-neutral-200 dark:border-neutral-700 rounded-full text-sm font-medium text-primary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cta-500" />
                )}
              </div>

              <button onClick={resetFilters} className="text-sm font-medium text-primary-600 hover:text-error-500 transition-colors ml-auto">Réinitialiser tout</button>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              <button onClick={() => changeFiliere("")} className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${filiereCode === "" ? "bg-primary-900 dark:bg-cta-500 text-white dark:text-primary-900" : "bg-neutral-100 dark:bg-primary-800 text-primary-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-primary-700"}`}>Toutes les filières</button>
              {filieres.map((f) => (
                <button key={f.id} onClick={() => changeFiliere(f.code)} className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${filiereCode === f.code ? "bg-primary-900 dark:bg-cta-500 text-white dark:text-primary-900" : "bg-neutral-100 dark:bg-primary-800 text-primary-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-primary-700"}`}>{f.code}</button>
              ))}
            </div>

            {(domainesDisponibles.length > 0 || parcoursDisponibles.length > 0) && (
              <div className="space-y-2 mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                {parcoursDisponibles.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-primary-700 uppercase tracking-wide mr-2">Parcours :</span>
                    <button onClick={() => changeParcours("")} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${parcours === "" ? "bg-cta-500 text-primary-900" : "border border-neutral-200 dark:border-neutral-700 text-primary-700 hover:border-cta-500"}`}>Tous</button>
                    {parcoursDisponibles.map((p) => (
                      <button key={p} onClick={() => changeParcours(p)} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${parcours === p ? "bg-cta-500 text-primary-900" : "border border-neutral-200 dark:border-neutral-700 text-primary-700 hover:border-cta-500"}`}>{p}</button>
                    ))}
                  </div>
                )}
                {domainesDisponibles.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-primary-700 uppercase tracking-wide mr-2">Domaine :</span>
                    <button onClick={() => setDomaine("")} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${domaine === "" ? "bg-cta-500 text-primary-900" : "border border-neutral-200 dark:border-neutral-700 text-primary-700 hover:border-cta-500"}`}>Tous</button>
                    {domainesDisponibles.map((d) => (
                      <button key={d} onClick={() => setDomaine(d)} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${domaine === d ? "bg-cta-500 text-primary-900" : "border border-neutral-200 dark:border-neutral-700 text-primary-700 hover:border-cta-500"}`}>{d}</button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <p className="text-sm font-medium text-primary-700 mb-6">{formatted.length} mémoire{formatted.length > 1 ? "s" : ""} trouvé{formatted.length > 1 ? "s" : ""}</p>
          
          {isLoading ? (
            <p className="text-center text-primary-600 py-12">Chargement…</p>
          ) : formatted.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-primary-900/50 p-12 text-center">
              <h3 className="text-lg font-bold text-primary-900 dark:text-white mb-2">Aucun mémoire trouvé</h3>
              <p className="text-primary-600 mb-6">Essayez de modifier vos critères de recherche.</p>
              <button onClick={resetFilters} className="px-6 py-2.5 rounded-full border-2 border-primary-900 dark:border-white text-primary-900 dark:text-white text-sm font-semibold hover:bg-primary-900 hover:text-white transition-colors">Réinitialiser les filtres</button>
            </div>
          ) : (
            <>
              {/* GRILLE DE CARTES (4 par ligne max) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginated.map((project) => <ProjectCard key={project.id} project={project} onOpen={(slug) => setSelectedSlug(slug)} />)}
              </div>

              {/* 👇 PAGINATION AJOUTÉE ICI */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12 pb-8">
                  <button 
                    onClick={() => setPage(p => Math.max(1, p - 1))} 
                    disabled={currentPage === 1}
                    className="p-2 rounded-full border border-neutral-200 dark:border-neutral-700 text-primary-900 dark:text-white disabled:opacity-30 hover:bg-neutral-100 dark:hover:bg-primary-800 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNumber = i + 1;
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setPage(pageNumber)}
                        className={`w-10 h-10 rounded-full text-sm font-bold transition-colors ${
                          currentPage === pageNumber 
                            ? "bg-primary-900 dark:bg-cta-500 text-white dark:text-primary-900" 
                            : "text-primary-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-primary-800"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}

                  <button 
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-full border border-neutral-200 dark:border-neutral-700 text-primary-900 dark:text-white disabled:opacity-30 hover:bg-neutral-100 dark:hover:bg-primary-800 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </Container>
      </main>

      <MemoireModal slug={selectedSlug} onClose={() => setSelectedSlug(null)} />
    </>
  );
}