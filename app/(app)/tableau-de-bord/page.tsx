"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Plus, Bookmark, ArrowRight } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/trpc/client";
import { Container } from "@/components/layout/Container";
import { ProjectCard } from "@/components/landing/ProjectCard";

// Dictionnaire de couleurs pour les filières
const filiereColorMap: Record<string, string> = {
  TCO: "bg-primary-500", 
  EN: "bg-warning-500", 
  GE: "bg-success-500", 
  BTP: "bg-purple-600",
};

export default function TableauDeBordPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [searchQuery, setSearchQuery] = useState("");

  // Récupération des données via tRPC
  const { data: myPublications = [] } = trpc.memoire.mine.useQuery(undefined, { enabled: !!session });
  const { data: favorites = [] } = trpc.favori.list.useQuery(undefined, { enabled: !!session });
  
  // Requête pour les mémoires récents (adaptée selon tes paramètres)
  const { data: recentMemoires = [] } = trpc.memoire.list.useQuery(
    { search: "", filiere: "", domaine: "", parcours: "", niveau: "", annee: undefined }, 
    { enabled: !!session }
  );

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F5F7] dark:bg-[#051414]">
        <div className="w-8 h-8 rounded-full border-4 border-[#CEEC22] border-t-transparent animate-spin" />
      </div>
    );
  }

  // Extraction sécurisée du prénom
  const firstName = session?.user?.name ? session.user.name.split(" ")[0] : "Étudiant";

  // 👇 FORMATAGE DE LA PREMIÈRE PUBLICATION POUR LE COMPOSANT PROJECTCARD
  const firstPublication = myPublications[0];
  const formattedPublication = firstPublication ? {
    id: String(firstPublication.id),
    slug: firstPublication.slug || "",
    title: firstPublication.title || "Sans titre",
    summary: firstPublication.summary || "",
    image: firstPublication.image ?? "/images/projects/telecom.jpg",
    filiere: firstPublication.filiereName ?? "", 
    filiereCode: firstPublication.filiereCode ?? "",
    filiereColor: filiereColorMap[firstPublication.filiereCode ?? ""] ?? "bg-primary-500",
    author: session?.user?.name ?? "Vous",
    authorAvatar: session?.user?.image ?? "/images/authors/authors1.jpg",
    authorImage: session?.user?.image ?? "/images/authors/authors1.jpg",
    niveau: firstPublication.niveau || "",
    year: firstPublication.annee || new Date().getFullYear(),
    pages: 0,
    encadreur: firstPublication.encadreur || "",
    keywords: [] as string[],
  } : null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explorer?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    // pt-8 et pt-12 pour corriger le texte écrasé par le haut
    <div className="pt-8 md:pt-12 pb-16">
      <Container>
        
        {/* En-tête avec le Bonjour */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-bold text-[#0A1E1E] dark:text-white mb-4 font-heading">
            Bonjour, {firstName} !
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-lg">
            Que souhaitez-vous explorer aujourd'hui ?
          </p>
        </div>

        {/* Barre de recherche centrale */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un mémoire, une filière ou un auteur..."
            className="w-full h-14 pl-6 pr-16 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#0A1E1E] text-[#0A1E1E] dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#184F53] shadow-sm text-lg"
          />
          <button 
            type="submit" 
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#CEEC22] rounded-full flex items-center justify-center hover:bg-[#b5d11b] transition-colors"
          >
            <Search className="w-5 h-5 text-[#0A1E1E]" />
          </button>
        </form>

        {/* Grille des 3 cartes principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* Carte 1 : Explorer */}
          <div className="relative rounded-[2rem] overflow-hidden bg-[#184F53] text-white p-8 flex flex-col justify-between min-h-[300px] shadow-lg group">
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold mb-4">Explorer</span>
              <h2 className="text-2xl font-bold leading-tight mb-4">Parcourez les travaux de votre filière</h2>
            </div>
            <div className="relative z-10 mt-auto">
              <p className="text-sm text-white/70 mb-3 uppercase tracking-wider font-semibold">Parcours</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-[#CEEC22] text-[#0A1E1E] rounded-full text-xs font-bold">STI</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold">RS</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold">RC</span>
              </div>
            </div>
            <Link href="/explorer" className="absolute inset-0 z-20" aria-label="Explorer les mémoires" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-0" />
          </div>

          {/* Carte 2 : Mes publications */}
          <div className="bg-white dark:bg-[#0A1E1E] rounded-[2rem] p-8 shadow-sm border border-neutral-100 dark:border-neutral-800 flex flex-col min-h-[300px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#0A1E1E] dark:text-white">Mes publications</h2>
              <Link href="/publication" className="text-xs font-bold text-neutral-500 hover:text-[#184F53] dark:hover:text-[#CEEC22] bg-neutral-100 dark:bg-white/5 px-3 py-1 rounded-full">
                Voir tout
              </Link>
            </div>
            
            {/* 👇 CORRECTION ICI : Utilisation de formattedPublication */}
            {formattedPublication ? (
              <div className="flex-1 flex flex-col justify-center">
                <ProjectCard project={formattedPublication} />
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
                <p className="text-neutral-500 text-sm mb-4">Aucune publication</p>
                <Link href="/publier" className="inline-flex items-center gap-2 px-4 py-2 bg-[#CEEC22] text-[#0A1E1E] text-sm font-bold rounded-full hover:bg-[#b5d11b] transition-colors">
                  <Plus className="w-4 h-4" /> Publier
                </Link>
              </div>
            )}
          </div>

          {/* Carte 3 : Enregistrements */}
          <div className="bg-white dark:bg-[#0A1E1E] rounded-[2rem] p-8 shadow-sm border border-neutral-100 dark:border-neutral-800 flex flex-col min-h-[300px] items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-white/5 flex items-center justify-center mb-4">
              <Bookmark className="w-6 h-6 text-[#184F53] dark:text-[#CEEC22]" />
            </div>
            <h2 className="text-xl font-bold text-[#0A1E1E] dark:text-white mb-2">Enregistrements</h2>
            <p className="text-5xl font-black text-[#CEEC22] mb-2">{favorites.length}</p>
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-6">Mémoire{favorites.length > 1 ? "s" : ""} enregistré{favorites.length > 1 ? "s" : ""}</p>
            
            <Link href="/favoris" className="inline-flex items-center gap-2 px-6 py-3 bg-[#CEEC22] text-[#0A1E1E] text-sm font-bold rounded-full hover:bg-[#b5d11b] transition-colors w-full justify-center">
              Voir tout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

        {/* Section : Récemment publiés */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#0A1E1E] dark:text-white">Récemment publiés</h2>
            <Link href="/explorer" className="text-sm font-bold text-[#184F53] dark:text-[#CEEC22] flex items-center gap-1 hover:underline">
              Voir tout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentMemoires.slice(0, 4).map((memoire: any) => {
               // Formatage des mémoires récents pour ProjectCard (si tu veux les afficher en vraie carte)
               const formattedRecent = {
                  id: String(memoire.id),
                  slug: memoire.slug || "",
                  title: memoire.title || "Sans titre",
                  summary: memoire.summary || "",
                  image: memoire.image ?? "/images/projects/telecom.jpg",
                  filiere: memoire.filiereName ?? "", 
                  filiereCode: memoire.filiereCode ?? "",
                  filiereColor: filiereColorMap[memoire.filiereCode ?? ""] ?? "bg-primary-500",
                  author: memoire.authorName ?? "Auteur",
                  authorAvatar: memoire.authorImage ?? "/images/authors/authors1.jpg",
                  authorImage: memoire.authorImage ?? "/images/authors/authors1.jpg",
                  niveau: memoire.niveau || "",
                  year: memoire.annee || new Date().getFullYear(),
                  pages: 0,
                  encadreur: memoire.encadreur || "",
                  keywords: [] as string[],
               };
               
               return (
                  <ProjectCard key={memoire.id} project={formattedRecent} />
               );
            })}
          </div>
        </div>

      </Container>
    </div>
  );
}