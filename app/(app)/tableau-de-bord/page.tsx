"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Search, ArrowRight, Bookmark, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { ProjectCard } from "@/components/landing/ProjectCard";
import { FlashToast } from "@/components/ui/FlashToast";
import { trpc } from "@/trpc/client";
import { authClient } from "@/lib/auth-client";
import { filieres } from "@/lib/data/filieres";

const parcoursParFiliere: Record<string, string[]> = {
  IGAT: ["IGF", "GT"],
  GMI: ["GI", "GMD", "STGI", "IM", "MA"],
  GPCI: ["VRM", "BIO", "STGP", "LP"],
  IMIN: ["STM", "GEO-ENERGIE", "GLB"],
  GE: ["SERI", "IE", "REER", "MEAI"],
  GPAE: ["TAA", "EE"],
  GGEO: ["GEA", "GM", "GSS"],
  IPE: ["STP", "PCH", "BEEN"],
  BTP: ["BTP", "Géotechnique"],
  HYDR: ["AEH", "AEP", "AHA"],
  EN: ["EA", "IA"],
  ISA: [],
  UAGC: [],
  MTO: ["Science de l'Atmosphère", "Météorologie Appliquée", "Hydrologie"],
  SIM: ["MOC", "MCM", "GMAT"],
  TCO: ["STI", "RS", "RC"],
};

const filiereImageMap: Record<string, string> = {
  TCO: "/images/projects/telecom.jpg",
  GE: "/images/projects/solar.jpg",
  EN: "/images/projects/circuit.jpg",
  BTP: "/images/projects/bridge.jpg",
};

const filiereColorMap: Record<string, string> = {
  TCO: "bg-primary-500", EN: "bg-warning-500", GE: "bg-success-500", BTP: "bg-purple-600",
};

const MAX_PUBLICATIONS = 3;

export default function TableauDeBordPage() {
  const { data: session } = authClient.useSession();
  const prenom = session?.user?.name?.split(" ")[0] ?? "";
  
  const { data: profileData } = trpc.profile.get.useQuery(undefined, {
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
  
  const [flash, setFlash] = useState<{ text: string; link: string; linkText: string } | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("flashMessage");
    if (stored) {
      try { setFlash(JSON.parse(stored)); sessionStorage.removeItem("flashMessage"); } catch {}
    }
  }, []);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 8000);
    return () => clearTimeout(t);
  }, [flash]);

  const { data: ids = [] } = trpc.favori.ids.useQuery();
  const { data: memoiresRecents = [] } = trpc.memoire.recent.useQuery();
  const { data: mesPublicationsDB = [] } = trpc.memoire.mine.useQuery(undefined, { enabled: !!session });

  const nbFavoris = ids.length;
  
  const myFiliereCode = profileData?.filiereCode || ""; 
  const currentFiliere = filieres.find((f) => f.code === myFiliereCode);
  
  const myFiliereName = currentFiliere?.name || "votre filière";
  const myParcours = profileData?.profile?.parcours || "";
  
  const parcoursDisponibles = myFiliereCode ? (parcoursParFiliere[myFiliereCode] || []) : [];
  const currentFiliereImage = myFiliereCode 
    ? (filiereImageMap[myFiliereCode] || "/images/projects/telecom.jpg")
    : "/images/projects/telecom.jpg";

  const mesPublications = mesPublicationsDB.slice(0, MAX_PUBLICATIONS);

  const derniers = memoiresRecents.slice(0, 4).map((m) => ({
    id: String(m.id), slug: m.slug, title: m.title, summary: m.summary, image: m.image ?? "/images/projects/telecom.jpg",
    filiere: m.filiereName ?? "", filiereCode: m.filiereCode ?? "", filiereColor: filiereColorMap[m.filiereCode ?? ""] ?? "bg-primary-500",
    author: m.authorName ?? "Auteur", authorImage: m.authorImage ?? "/images/authors/authors1.jpg", authorAvatar: m.authorImage ?? "/images/authors/authors1.jpg",
    niveau: m.niveau, year: m.annee, pages: 0, encadreur: m.encadreur, keywords: [] as string[],
  }));

  return (
    <>
      {flash && <FlashToast text={flash.text} link={flash.link} linkText={flash.linkText} onClose={() => setFlash(null)} />}

      <Container className="py-8 md:py-12 max-w-6xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-white font-heading mb-2">
            Bonjour, {prenom} !
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Que souhaitez-vous explorer aujourd&apos;hui ?
          </p>
        </div>

        <form action="/explorer" method="get" className="relative max-w-2xl mx-auto mb-12">
          <input 
            type="text" 
            name="q" 
            placeholder="Rechercher un mémoire, une filière ou un auteur…" 
            className="w-full px-6 py-4 pr-14 rounded-full bg-white dark:bg-primary-900 border border-neutral-200 dark:border-neutral-700 text-primary-900 dark:text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-cta-500 shadow-sm" 
          />
          <button 
            type="submit" 
            aria-label="Rechercher" 
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-cta-500 hover:bg-cta-400 p-3 rounded-full transition-colors"
          >
            <Search className="w-5 h-5 text-primary-900" />
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 items-stretch">
          
          {/* 1. CARTE EXPLORER */}
          <div className="group relative overflow-hidden rounded-[2rem] bg-neutral-900 flex flex-col justify-between h-[340px] shadow-lg transition-all duration-300">
            <Image 
              src={currentFiliereImage} 
              alt={`Image de la filière`}
              fill 
              className="object-cover opacity-100 group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:bg-black/30 transition-colors duration-300" />
            
            {myFiliereCode && (
              <Link href={`/explorer?filiere=${myFiliereCode}`} className="absolute inset-0 z-0" aria-label="Explorer la filière" />
            )}

            <div className="relative z-10 p-6 pointer-events-none">
              <span className="inline-block bg-white/20 backdrop-blur-md text-white border border-white/30 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                Explorer
              </span>
              <h2 className="text-2xl font-bold text-white font-heading leading-tight drop-shadow-md">
                Parcourez les travaux de votre filière
              </h2>
            </div>
            
            <div className="relative z-10 p-6 pointer-events-auto">
              <p className="text-[10px] text-white/90 mb-2 font-bold uppercase tracking-widest drop-shadow-md">
                Parcours
              </p>
              <div className="flex flex-wrap gap-2">
                {parcoursDisponibles.length > 0 ? (
                  parcoursDisponibles.map((p) => (
                    <Link 
                      key={p}
                      href={`/explorer?filiere=${myFiliereCode}&parcours=${encodeURIComponent(p)}`}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all backdrop-blur-md ${
                        p === myParcours 
                          ? "bg-cta-500 text-primary-900 shadow-sm border border-cta-500" 
                          : "bg-white/10 text-white border border-white/40 hover:bg-white hover:text-black hover:border-white"
                      }`}
                    >
                      {p}
                    </Link>
                  ))
                ) : (
                  <span className="text-xs text-white/80 italic drop-shadow-sm">Aucun parcours défini</span>
                )}
              </div>
            </div>
          </div>

          {/* 2. CARTE MES PUBLICATIONS */}
          <div className="rounded-[2rem] bg-white dark:bg-primary-950 p-6 flex flex-col h-[340px] shadow-sm border border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-primary-900 dark:text-white font-heading">
                Mes publications
              </h2>
              <Link href="/publication" className="text-xs font-semibold bg-neutral-100 dark:bg-primary-900 text-neutral-600 dark:text-neutral-300 px-3 py-1.5 rounded-full hover:bg-neutral-200 dark:hover:bg-primary-800 transition-colors">
                Voir tout
              </Link>
            </div>
            
            <div className="flex-1 flex flex-col">
              {mesPublications.length > 0 ? (
                <>
                  <p className="text-sm font-bold text-primary-900 dark:text-white line-clamp-2 mb-3">
                    {mesPublications[0].title}
                  </p>
                  
                  <Link href={`/memoires/${mesPublications[0].slug}`} className="block mt-auto p-1.5 bg-neutral-50 dark:bg-primary-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 group">
                    <div className="relative w-full h-[140px] rounded-xl overflow-hidden">
                      <Image 
                        src={mesPublications[0].image ?? "/images/projects/telecom.jpg"} 
                        alt={mesPublications[0].title} 
                        fill 
                        sizes="300px" 
                        className="object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                  </Link>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-2xl bg-neutral-50 dark:bg-primary-900/30">
                  <p className="text-sm text-neutral-400 mb-3">Aucune publication</p>
                  <Link href="/publier" className="inline-flex items-center gap-1.5 bg-cta-500 text-primary-900 text-xs font-semibold rounded-full px-4 py-2 hover:bg-cta-400 transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Publier
                  </Link>
                </div>
              )}
              
              <div className="flex items-center justify-between pt-4 mt-2">
                <span className="text-xs font-medium text-neutral-400">
                  1 / {MAX_PUBLICATIONS}
                </span>
                <div className="flex gap-2">
                  <button className="w-7 h-7 rounded-full border border-neutral-200 dark:border-neutral-700 flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-primary-800 transition-colors">
                    <ChevronLeft className="w-4 h-4 text-neutral-500" />
                  </button>
                  <button className="w-7 h-7 rounded-full border border-neutral-200 dark:border-neutral-700 flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-primary-800 transition-colors">
                    <ChevronRight className="w-4 h-4 text-neutral-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 3. CARTE ENREGISTREMENTS */}
          <div className="rounded-[2rem] bg-[#F8F9FA] dark:bg-primary-900 p-6 flex flex-col h-[340px] shadow-sm relative overflow-hidden group border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-start justify-between mb-2 relative z-10">
              <h2 className="text-lg font-bold text-primary-900 dark:text-white font-heading">
                Enregistrements
              </h2>
              <Bookmark className="w-5 h-5 text-primary-900 dark:text-white" />
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10">
              <p className="text-7xl font-black text-cta-500 mb-1 drop-shadow-sm">{nbFavoris}</p>
              <p className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 mb-6 uppercase tracking-widest">
                Mémoire{nbFavoris > 1 ? "s" : ""} enregistré{nbFavoris > 1 ? "s" : ""}
              </p>
              
              <Link href="/favoris" className="inline-flex items-center justify-center gap-2 w-full bg-cta-500 text-primary-900 text-sm font-semibold rounded-full px-5 py-3 hover:bg-cta-400 transition-all shadow-md">
                Voir tout <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-primary-900 dark:text-white font-heading">
            Récemment publiés
          </h2>
          <Link href="/explorer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-900 dark:text-white hover:text-cta-600 transition-colors group">
            Voir tout <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {derniers.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </Container>
    </>
  );
}