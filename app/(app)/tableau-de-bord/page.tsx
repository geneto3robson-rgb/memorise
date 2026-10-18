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
  IGAT: ["IGF", "GT"], GMI: ["GI", "GMD", "STGI", "IM", "MA"], GPCI: ["VRM", "BIO", "STGP", "LP"],
  IMIN: ["STM", "GEO-ENERGIE", "GLB"], GE: ["SERI", "IE", "REER", "MEAI"], GPAE: ["TAA", "EE"],
  GGEO: [], IPE: ["STP", "PCH", "BEEN"], BTP: ["BTP", "Géotechnique"], HYDR: ["AEH", "AEP", "AHA"],
  EN: ["EA", "IA"], ISA: [], UAGC: [], MTOH: [], SIM: ["MOC", "MCM", "G MAT"], TCO: ["STI", "RS", "RC"],
};

const filiereImageMap: Record<string, string> = {
  GE: "/images/projects/solar.jpg", EN: "/images/projects/circuit.jpg", BTP: "/images/projects/bridge.jpg",
};

const filiereColorMap: Record<string, string> = {
  TCO: "bg-primary-500", EN: "bg-warning-500", GE: "bg-success-500", BTP: "bg-purple-600",
};

const MAX_PUBLICATIONS = 3;

export default function TableauDeBordPage() {
  const { data: session } = authClient.useSession();
  const prenom = session?.user?.name?.split(" ")[0] ?? "";
  const { data: profileData } = trpc.profile.get.useQuery();
  
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

  const { data: ids = [] } = trpc.favori.ids.useQuery(undefined, { enabled: !!session });
  const { data: memoiresRecents = [] } = trpc.memoire.recent.useQuery();
  const { data: mesPublicationsDB = [] } = trpc.memoire.mine.useQuery(undefined, { enabled: !!session });

  const nbFavoris = ids.length;
  
  const myFiliereId = profileData?.profile?.filiereId;
  const currentFiliere = filieres.find((f) => String(f.id) === String(myFiliereId));
  
  const myFiliereCode = currentFiliere?.code || "EN"; 
  const myParcours = profileData?.profile?.parcours || "";
  const parcoursDisponibles = parcoursParFiliere[myFiliereCode] || [];
  const currentFiliereImage = filiereImageMap[myFiliereCode] || "/images/projects/telecom.jpg";

  const mesPublications = mesPublicationsDB.slice(0, MAX_PUBLICATIONS);

  const [pubIndex, setPubIndex] = useState(0);
  const currentPub = mesPublications[pubIndex];

  useEffect(() => { if (pubIndex >= mesPublications.length) setPubIndex(0); }, [mesPublications.length, pubIndex]);

  const nextPub = () => { if (mesPublications.length > 1) setPubIndex((prev) => (prev + 1) % mesPublications.length); };
  const prevPub = () => { if (mesPublications.length > 1) setPubIndex((prev) => (prev - 1 + mesPublications.length) % mesPublications.length); };

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
          <p className="text-neutral-600 dark:text-neutral-400">Que souhaitez-vous explorer aujourd&apos;hui ?</p>
        </div>

        <form action="/explorer" method="get" className="relative max-w-2xl mx-auto mb-12">
          <input type="text" name="q" placeholder="Rechercher un mémoire, une filière ou un auteur…" className="w-full px-6 py-4 pr-14 rounded-full bg-white dark:bg-primary-900 border border-neutral-200 dark:border-neutral-700 text-primary-900 dark:text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-cta-500 shadow-sm" />
          <button type="submit" aria-label="Rechercher" className="absolute right-2 top-1/2 -translate-y-1/2 bg-cta-500 hover:bg-cta-400 p-3 rounded-full transition-colors">
            <Search className="w-5 h-5 text-primary-900" />
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 items-stretch">
          
          {/* CARTE 1 : EXPLORER */}
          <div className="relative overflow-hidden rounded-[2rem] bg-neutral-900 flex flex-col justify-between h-[340px] shadow-lg">
            <Image src={currentFiliereImage} alt="Image" fill className="object-cover opacity-100" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="relative z-10 p-6 flex flex-col h-full justify-between">
              <div>
                <Link href={`/explorer?filiere=${myFiliereCode}`} className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md text-white border border-white/30 text-xs font-semibold px-3 py-1 rounded-full mb-4 hover:bg-white/30 transition-colors">
                  Explorer <ArrowRight className="w-3 h-3" />
                </Link>
                <h2 className="text-2xl font-bold text-white font-heading leading-tight drop-shadow-md">
                  Parcourez les travaux de votre filière
                </h2>
              </div>
              
              <div>
                <p className="text-[10px] text-white/90 mb-2 font-bold uppercase tracking-widest drop-shadow-md">Parcours</p>
                <div className="flex flex-wrap gap-2">
                  {parcoursDisponibles.length > 0 ? (
                    parcoursDisponibles.map((p) => (
                      <Link key={p} href={`/explorer?filiere=${myFiliereCode}&parcours=${encodeURIComponent(p)}`} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all backdrop-blur-md ${p === myParcours ? "bg-cta-500 text-primary-900 shadow-sm border border-cta-500" : "bg-white/10 text-white border border-white/40 hover:bg-white hover:text-black"}`}>
                        {p}
                      </Link>
                    ))
                  ) : (
                    <span className="text-xs text-white/80 italic">Aucun parcours défini</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* CARTE 2 : MES PUBLICATIONS (4 Coins arrondis) */}
          <div className="rounded-[2rem] bg-white dark:bg-primary-950 p-6 flex flex-col h-[340px] shadow-sm border border-neutral-100 dark:border-neutral-800 relative overflow-hidden">
            
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-primary-900 dark:text-white font-heading">Mes publications</h2>
              <Link href="/publication" className="text-xs font-semibold bg-neutral-100 dark:bg-primary-900 text-neutral-600 dark:text-neutral-300 px-3 py-1.5 rounded-full hover:bg-neutral-200 transition-colors">
                Voir tout
              </Link>
            </div>
            
            {mesPublications.length > 0 ? (
              <div className="flex-1 flex flex-col relative">
                
                {/* Espace flexible pour pousser le contenu vers le bas */}
                <div className="flex-1" />

                {/* Titre collé à l'image */}
                <h3 className="text-base font-bold text-primary-900 dark:text-white line-clamp-2 mb-3">
                  {mesPublications[0].title}
                </h3>
                
                {/* IMAGE AVEC 4 COINS ARRONDIS */}
                <div className="relative w-full h-[160px] rounded-xl overflow-hidden group">
                  <Image src={mesPublications[0].image ?? "/images/projects/telecom.jpg"} alt={mesPublications[0].title} fill sizes="800px" className="object-cover object-center group-hover:scale-105 transition-transform duration-500" />
                  
                  {/* Pagination superposée */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-md p-1.5 rounded-full border border-white/20">
                    <button onClick={prevPub} disabled={mesPublications.length <= 1} className="w-6 h-6 flex items-center justify-center rounded-full text-white hover:bg-white/20 disabled:opacity-30">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-[10px] font-bold text-white px-1">{pubIndex + 1}/{mesPublications.length}</span>
                    <button onClick={nextPub} disabled={mesPublications.length <= 1} className="w-6 h-6 flex items-center justify-center rounded-full text-white hover:bg-white/20 disabled:opacity-30">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-2xl bg-neutral-50 dark:bg-primary-900/30">
                <p className="text-sm text-neutral-400 mb-3">Aucune publication</p>
                <Link href="/publier" className="px-5 py-2 bg-cta-500 text-primary-950 text-xs font-semibold rounded-full hover:bg-cta-400 transition-colors shadow-sm flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Publier
                </Link>
              </div>
            )}
          </div>

          {/* CARTE 3 : ENREGISTREMENTS */}
          <div className="rounded-[2rem] bg-[#F8F9FA] dark:bg-primary-900 p-6 flex flex-col h-[340px] shadow-sm relative overflow-hidden group border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-start justify-between mb-2 relative z-10">
              <h2 className="text-xl font-bold text-primary-900 dark:text-white font-heading">Enregistrements</h2>
              <Bookmark className="w-5 h-5 text-primary-900 dark:text-white" />
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10">
              <p className="text-7xl font-black text-cta-500 mb-1 drop-shadow-sm">{nbFavoris}</p>
              <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-6 uppercase tracking-widest">
                Mémoire{nbFavoris > 1 ? "s" : ""} enregistré{nbFavoris > 1 ? "s" : ""}
              </p>
              
              <Link href="/favoris" className="inline-flex items-center justify-center gap-2 w-full bg-cta-500 text-primary-900 text-sm font-semibold rounded-full px-5 py-3 hover:bg-cta-400 transition-all shadow-md">
                Voir tout <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-primary-900 dark:text-white font-heading">Récemment publiés</h2>
          <Link href="/explorer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-900 dark:text-white hover:text-cta-600 transition-colors group">
            Voir tout <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {derniers.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>
      </Container>
    </>
  );
}