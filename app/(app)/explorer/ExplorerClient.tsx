"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search, ArrowLeft, SlidersHorizontal, X, ChevronDown } from "lucide-react"; 
import { Container } from "@/components/layout/Container";
import { ProjectCard } from "@/components/landing/ProjectCard";
import { MemoireModal } from "@/components/memoire/MemoireModal";
import { filieres } from "@/lib/data/filieres";
import { trpc } from "@/trpc/client";
import { domainesParFiliere } from "@/lib/data/domaines";
import { authClient } from "@/lib/auth-client";

const PER_PAGE = 10;
const niveaux = ["L3", "M2"];
const currentYear = new Date().getFullYear();
const annees = Array.from({ length: 15 }, (_, i) => currentYear - i);

const filiereColorMap: Record<string, string> = {
  TCO: "bg-primary-500", EN: "bg-warning-500", GE: "bg-success-500", BTP: "bg-purple-600",
};

const parcoursParFiliere: Record<string, string[]> = {
  IGAT: ["IGF", "GT"], GMI: ["GI", "GMD", "STGI", "IM", "MA"], GPCI: ["VRM", "BIO", "STGP", "LP"],
  IMIN: ["STM", "GEO-ENERGIE", "GLB"], GE: ["SERI", "IE", "REER", "ME", "AI"], GPAE: ["TAA", "EE"],
  GGEO: ["GEA", "GM", "GSS"], IPE: ["STP", "PCH", "BEEN"], BTP: ["BTP", "Géotechnique"],
  HYDR: ["AEH", "AEP", "AHA"], EN: ["EA", "IA"], ISA: ["Ingénierie Mécatronique", "Ingénierie de Sciences Cognitives"],
  UAGC: [], MTO: ["Science de l'Atmosphère", "Météorologie Appliquée", "Hydrologie"], SIM: ["MOC", "MCM", "GMAT"], TCO: ["STI", "RS", "RC"],
};

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
  
  const [showFilters, setShowFilters] = useState(false);

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
    <div className="min-h-screen bg-[#F4F5F7] dark:bg-[#051414] pb-24">
      
      {!session && (
        <div className="relative pt-24 pb-16 px-4 overflow-hidden">
          <Image src="/images/hero-bg.jpg" alt="Hero" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-[#0A1E1E]/70" />
          
          <Container className="relative z-10 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-heading">
              Explorer les mémoires
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto">
              Parcourez le catalogue des travaux de fin d'études de l'ESPA.
            </p>
          </Container>
        </div>
      )}

      {/* 👇 CORRECTION ICI : -mt-12 pour le chevauchement, plus de fond gris 👇 */}
      <Container className={session ? "pt-8" : "pt-0 relative z-20 -mt-12"}>
        
        <div className="pt-4 pb-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un mémoire, un auteur..."
                className="w-full h-14 pl-14 pr-4 rounded-full bg-white dark:bg-[#0A1E1E] text-[#0A1E1E] dark:text-white placeholder-neutral-400 shadow-xl border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#184F53] text-base"
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            </div>
            
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden w-14 h-14 shrink-0 rounded-full bg-[#184F53] dark:bg-[#CEEC22] text-white dark:text-[#0A1E1E] flex items-center justify-center shadow-md"
            >
              {showFilters ? <X className="w-5 h-5" /> : <SlidersHorizontal className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex overflow-x-auto gap-2 mt-4 pb-2 scrollbar-hide">
            <button onClick={() => changeFiliere("")} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${filiereCode === "" ? "bg-[#0A1E1E] text-white dark:bg-[#CEEC22] dark:text-[#0A1E1E]" : "bg-white dark:bg-[#0A1E1E] text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800"}`}>
              Toutes les filières
            </button>
            {filieres.map((f) => (
              <button key={f.id} onClick={() => changeFiliere(f.code)} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${filiereCode === f.code ? "bg-[#0A1E1E] text-white dark:bg-[#CEEC22] dark:text-[#0A1E1E]" : "bg-white dark:bg-[#0A1E1E] text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800"}`}>
                {f.code}
              </button>
            ))}
          </div>
        </div>

        {/* Filtres avancés */}
        <div className={`${showFilters ? "block" : "hidden"} lg:block bg-white dark:bg-[#0A1E1E] border border-neutral-200 dark:border-neutral-800 rounded-3xl p-5 mb-8 shadow-sm`}>
          <div className="flex flex-wrap items-center gap-3">
            {/* ... (Reste des filtres inchangé) ... */}
            <div className="relative min-w-[140px] flex-1 sm:flex-none">
              <select value={sort} onChange={(e) => setSort(e.target.value as any)} className="w-full h-10 pl-4 pr-8 appearance-none bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-neutral-700 rounded-full text-xs font-bold text-[#0A1E1E] dark:text-white focus:outline-none">
                <option value="recent">Plus récents</option>
                <option value="oldest">Plus anciens</option>
                <option value="alphabetical">Titre (A-Z)</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
            </div>
            <div className="relative min-w-[140px] flex-1 sm:flex-none">
              <select value={niveau} onChange={(e) => setNiveau(e.target.value)} className="w-full h-10 pl-4 pr-8 appearance-none bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-neutral-700 rounded-full text-xs font-bold text-[#0A1E1E] dark:text-white focus:outline-none">
                <option value="">Tous les niveaux</option>
                {niveaux.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
            </div>
            <div className="relative min-w-[140px] flex-1 sm:flex-none">
              <select value={showCustomYear ? "custom" : annee} onChange={handleYearChange} className="w-full h-10 pl-4 pr-8 appearance-none bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-neutral-700 rounded-full text-xs font-bold text-[#0A1E1E] dark:text-white focus:outline-none">
                <option value="">Toutes les années</option>
                {annees.map(a => <option key={a} value={a}>{a}</option>)}
                <option value="custom">Autre...</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
            </div>
            {showCustomYear && (
              <input type="number" placeholder="2021" value={annee || ""} onChange={(e) => setAnnee(e.target.value ? Number(e.target.value) : "")} className="h-10 w-24 px-3 bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-neutral-700 rounded-full text-xs font-bold text-[#0A1E1E] dark:text-white focus:outline-none" />
            )}
            <button onClick={resetFilters} className="text-xs font-bold text-red-500 hover:underline ml-auto w-full sm:w-auto text-left sm:text-right mt-2 sm:mt-0">Effacer les filtres</button>
          </div>
          {(parcoursDisponibles.length > 0 || domainesDisponibles.length > 0) && (
            <div className="space-y-3 mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              {parcoursDisponibles.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-neutral-400 py-1 mr-2 uppercase">Parcours :</span>
                  <button onClick={() => changeParcours("")} className={`px-3 py-1 rounded-full text-xs font-bold ${parcours === "" ? "bg-[#CEEC22] text-[#0A1E1E]" : "bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-300"}`}>Tous</button>
                  {parcoursDisponibles.map(p => (
                    <button key={p} onClick={() => changeParcours(p)} className={`px-3 py-1 rounded-full text-xs font-bold ${parcours === p ? "bg-[#CEEC22] text-[#0A1E1E]" : "bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-300"}`}>{p}</button>
                  ))}
                </div>
              )}
              {domainesDisponibles.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-neutral-400 py-1 mr-2 uppercase">Domaine :</span>
                  <button onClick={() => setDomaine("")} className={`px-3 py-1 rounded-full text-xs font-bold ${domaine === "" ? "bg-[#184F53] text-white dark:bg-[#CEEC22] dark:text-[#0A1E1E]" : "bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-300"}`}>Tous</button>
                  {domainesDisponibles.map(d => (
                    <button key={d} onClick={() => setDomaine(d)} className={`px-3 py-1 rounded-full text-xs font-bold ${domaine === d ? "bg-[#184F53] text-white dark:bg-[#CEEC22] dark:text-[#0A1E1E]" : "bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-300"}`}>{d}</button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Résultats et Pagination */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-bold text-neutral-500">{formatted.length} mémoire{formatted.length > 1 ? "s" : ""} trouvé{formatted.length > 1 ? "s" : ""}</p>
        </div>
        {isLoading ? (
          <div className="py-20 text-center flex flex-col items-center">
            <div className="w-8 h-8 rounded-full border-4 border-[#184F53] border-t-[#CEEC22] animate-spin mb-4" />
            <p className="text-neutral-500 text-sm">Chargement des mémoires...</p>
          </div>
        ) : formatted.length === 0 ? (
          <div className="rounded-[2rem] border-2 border-dashed border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#0A1E1E] p-12 text-center">
            <h3 className="text-lg font-bold text-[#0A1E1E] dark:text-white mb-2">Aucun mémoire trouvé</h3>
            <p className="text-neutral-500 mb-6">Essayez de modifier vos critères de recherche.</p>
            <button onClick={resetFilters} className="px-6 py-2.5 rounded-full bg-[#0A1E1E] text-white dark:bg-[#CEEC22] dark:text-[#0A1E1E] text-sm font-bold hover:opacity-90 transition-colors">Réinitialiser</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {paginated.map((project) => (
                <ProjectCard key={project.id} project={project} onOpen={(slug) => setSelectedSlug(slug)} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12 pb-8">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-10 h-10 rounded-full bg-white dark:bg-[#0A1E1E] border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-[#0A1E1E] dark:text-white disabled:opacity-30">
                  &larr;
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button key={i + 1} onClick={() => setPage(i + 1)} className={`w-10 h-10 rounded-full text-sm font-bold transition-colors ${currentPage === i + 1 ? "bg-[#0A1E1E] dark:bg-[#CEEC22] text-white dark:text-[#0A1E1E]" : "bg-white dark:bg-[#0A1E1E] border border-neutral-200 dark:border-neutral-800 text-[#0A1E1E] dark:text-white hover:bg-neutral-50"}`}>
                    {i + 1}
                  </button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-10 h-10 rounded-full bg-white dark:bg-[#0A1E1E] border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-[#0A1E1E] dark:text-white disabled:opacity-30">
                  &rarr;
                </button>
              </div>
            )}
          </>
        )}
      </Container>

      <MemoireModal slug={selectedSlug} onClose={() => setSelectedSlug(null)} />
    </div>
  );
}