"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Search, ArrowRight, Plus, Bookmark } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { ProjectCard } from "@/components/landing/ProjectCard";
import { FlashToast } from "@/components/ui/FlashToast";
import { trpc } from "@/trpc/client";
import { authClient } from "@/lib/auth-client";
import { filieres } from "@/lib/data/filieres";

const parcoursParFiliere: Record<string, string[]> = {
  TCO: ["STI", "RS", "RC"],
  GE: ["Électrotechnique", "Énergie", "Automatisme"],
  BTP: ["GCG", "Bâtiment", "Hydraulique"],
};

const filiereColorMap: Record<string, string> = {
  TCO: "bg-primary-500", 
  EN: "bg-warning-500", 
  GE: "bg-success-500", 
  BTP: "bg-purple-600",
};

const MAX_PUBLICATIONS = 3;

export default function TableauDeBordPage() {
  const { data: session } = authClient.useSession();
  const prenom = session?.user?.name?.split(" ")[0] ?? "";
  const { data: profile } = trpc.profile.get.useQuery();
  
  const [flash, setFlash] = useState<{ text: string; link: string; linkText: string } | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("flashMessage");
    if (stored) { 
      try { 
        setFlash(JSON.parse(stored)); 
        sessionStorage.removeItem("flashMessage"); 
      } catch {} 
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
  
  // CORRECTION : On force "TCO" par défaut si la filière n'est pas trouvée
  const currentFiliere = filieres.find((f) => String(f.id) === String(profile?.profile?.filiereId));
  const myFiliereCode = currentFiliere?.code || "TCO"; 
  const myFiliereName = currentFiliere?.name || "Télécommunication";
  
  const myParcours = profile?.profile?.parcours || "";
  const parcoursDisponibles = parcoursParFiliere[myFiliereCode] || [];

  const mesPublications = mesPublicationsDB.slice(0, MAX_PUBLICATIONS);

  const derniers = memoiresRecents.slice(0, 4).map((m) => ({
    id: String(m.id), slug: m.slug, title: m.title, summary: m.summary, 
    image: m.image ?? "/images/projects/telecom.jpg",
    filiere: m.filiereName ?? "", filiereCode: m.filiereCode ?? "", 
    filiereColor: filiereColorMap[m.filiereCode ?? ""] ?? "bg-primary-500",
    author: m.authorName ?? "Auteur", authorAvatar: m.authorImage ?? "/images/authors/authors1.jpg",
    niveau: m.niveau, year: m.annee, pages: 0, encadreur: m.encadreur, keywords: [] as string[],
  }));

  return (
    <>
      {flash && <FlashToast text={flash.text} link={flash.link} linkText={flash.linkText} onClose={() => setFlash(null)} />}

      <Container className="py-6 md:py-10 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-white font-heading mb-2">
            Bonjour, {prenom} !
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">Que souhaitez-vous explorer aujourd&apos;hui ?</p>
        </div>

        <form action="/explorer" method="get" className="relative max-w-2xl mx-auto mb-10">
          <input 
            type="text" 
            name="q" 
            placeholder="Rechercher un mémoire, une filière ou un auteur…" 
            className="w-full px-6 py-3.5 pr-14 rounded-full bg-white dark:bg-primary-900 border border-neutral-200 dark:border-neutral-700 text-primary-900 dark:text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-cta-500 shadow-sm" 
          />
          <button 
            type="submit" 
            aria-label="Rechercher" 
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-cta-500 hover:bg-cta-400 p-2.5 rounded-full transition-colors"
          >
            <Search className="w-5 h-5 text-primary-900" />
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {/* CARTE EXPLORER */}
          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-800 to-primary-950 p-6 flex flex-col justify-between h-[260px] shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5 group-hover:opacity-10 transition-opacity" />
            <div className="relative z-10">
              <Link 
                href={`/explorer?filiere=${myFiliereCode}`} 
                className="inline-block bg-cta-500 text-primary-900 text-xs font-bold px-3 py-1 rounded-full mb-4 shadow-sm hover:bg-cta-400 transition-colors"
              >
                Explorer
              </Link>
              <Link href={`/explorer?filiere=${myFiliereCode}`}>
                <h2 className="text-2xl font-bold text-white font-heading leading-snug hover:text-cta-400 transition-colors">
                  Parcourez les travaux de {myFiliereName}
                </h2>
              </Link>
            </div>
            <div className="relative z-10">
              <p className="text-xs text-white/60 mb-2 font-medium uppercase tracking-wider">Parcours</p>
              <div className="flex flex-wrap gap-2">
                {parcoursDisponibles.length > 0 ? (
                  parcoursDisponibles.map((p) => (
                    <Link 
                      key={p} 
                      href={`/explorer?filiere=${myFiliereCode}&parcours=${p}`} 
                      className={`px-3 py-1 rounded-full text-xs transition-all ${
                        p === myParcours 
                          ? "bg-cta-500 text-primary-900 font-bold hover:bg-cta-400" 
                          : "border border-white/20 text-white hover:bg-white/10 hover:border-cta-500"
                      }`}
                    >
                      {p}
                    </Link>
                  ))
                ) : (
                  <span className="text-xs text-white/50">Parcours non défini</span>
                )}
              </div>
            </div>
          </div>

          {/* CARTE MES PUBLICATIONS */}
          <div className="rounded-3xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-primary-900 p-6 flex flex-col h-[260px] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-bold text-primary-900 dark:text-white font-heading">Mes publications</h2>
              <Link 
                href="/publication" 
                className="text-xs font-semibold bg-cta-500/10 text-cta-600 dark:text-cta-400 px-3 py-1 rounded-full hover:bg-cta-500 hover:text-primary-900 transition-colors"
              >
                Voir tout
              </Link>
            </div>
            <div className="flex-1 flex flex-col justify-between">
              {mesPublications.length > 0 ? (
                <Link 
                  href={`/memoires/${mesPublications[0].slug}`} 
                  className="relative block rounded-2xl overflow-hidden h-32 group"
                >
                  <Image 
                    src={mesPublications[0].image ?? "/images/projects/telecom.jpg"} 
                    alt={mesPublications[0].title} 
                    fill 
                    sizes="300px" 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-950/90 via-primary-950/20 to-transparent" />
                  <p className="absolute bottom-3 left-3 right-3 text-sm font-medium text-white line-clamp-2">
                    {mesPublications[0].title}
                  </p>
                </Link>
              ) : (
                <div className="h-32 rounded-2xl border-2 border-dashed border-neutral-200 dark:border-neutral-700 flex items-center justify-center">
                  <p className="text-sm text-neutral-400">Aucune publication</p>
                </div>
              )}
              
              <div className="flex items-center justify-between text-xs pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-500 font-medium">{mesPublications.length} / {MAX_PUBLICATIONS} publications</span>
                <Link 
                  href="/publier" 
                  className="inline-flex items-center gap-1 text-primary-900 dark:text-white font-semibold hover:text-cta-600 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Publier
                </Link>
              </div>
            </div>
          </div>

          {/* CARTE FAVORIS */}
          <div className="rounded-3xl bg-cta-500 p-6 flex flex-col h-[260px] shadow-lg relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
            <div className="flex items-start justify-between mb-4 relative z-10">
              <h2 className="text-xl font-bold text-primary-900 font-heading">Enregistrements</h2>
              <Bookmark className="w-5 h-5 text-primary-900" />
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10">
              <p className="text-6xl font-black text-primary-900 mb-1">{nbFavoris}</p>
              <p className="text-xs font-medium text-primary-900/70 mb-5 uppercase tracking-wide">
                mémoire{nbFavoris > 1 ? "s" : ""} enregistré{nbFavoris > 1 ? "s" : ""}
              </p>
              <Link 
                href="/favoris" 
                className="inline-flex items-center gap-1.5 bg-primary-900 text-white text-sm font-semibold rounded-full px-5 py-2.5 hover:bg-primary-800 hover:scale-105 transition-all shadow-md"
              >
                Voir tous les enregistrements <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-primary-900 dark:text-white font-heading">Récemment publiés</h2>
          <Link 
            href="/explorer" 
            className="inline-flex items-center gap-1 text-sm font-medium text-primary-900 dark:text-white hover:text-cta-600 transition-colors"
          >
            Voir tout <ArrowRight className="w-4 h-4" />
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