"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar, User, GraduationCap, Building2, Bookmark,
  MessageCircle, X, ExternalLink,
} from "lucide-react";
import { trpc } from "@/trpc/client";
import { authClient } from "@/lib/auth-client";
import { AuthPromptModal } from "@/components/layout/AuthPromptModal";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}
function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}
function WhatsappIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}

function formatWhatsAppNumber(phone: string) {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) cleaned = "261" + cleaned.substring(1);
  return cleaned;
}

function formatExternalUrl(url: string) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
}

interface MemoireDetailProps {
  slug: string;
  compact?: boolean;
}

export function MemoireDetail({ slug, compact = false }: MemoireDetailProps) {
  const searchParams = useSearchParams();
  const { data: session, isPending } = authClient.useSession();
  const utils = trpc.useUtils();

  const [showContact, setShowContact] = useState(false);
  const [showAuth, setShowAuth] = useState<null | "bookmark" | "contact">(null);

  const { data: memoire, isLoading } = trpc.memoire.bySlug.useQuery({ slug });

  const { data: ids = [] } = trpc.favori.ids.useQuery(undefined, {
    enabled: !!session,
  });

  const toggle = trpc.favori.toggle.useMutation({
    onMutate: async ({ memoireId }) => {
      await utils.favori.ids.cancel();
      const previous = utils.favori.ids.getData();
      utils.favori.ids.setData(undefined, (old = []) =>
        old.includes(memoireId)
          ? old.filter((id) => id !== memoireId)
          : [...old, memoireId]
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous !== undefined) {
        utils.favori.ids.setData(undefined, ctx.previous);
      }
    },
    onSettled: () => {
      utils.favori.list.invalidate();
    },
  });

  const notifyContact = trpc.memoire.notifyContact.useMutation();

  useEffect(() => {
    if (session && searchParams.get("contact") === "1") {
      setShowContact(true);
    }
  }, [session, searchParams]);

  if (isLoading) return <p className="text-center text-neutral-500 py-12">Chargement…</p>;
  if (!memoire) return (
    <div className="text-center py-12">
      <h2 className="text-xl font-bold text-primary-900 dark:text-white font-heading mb-3">
        Mémoire introuvable
      </h2>
      <Link href="/explorer" className="inline-block px-5 py-2 rounded-full bg-cta-500 hover:bg-cta-400 text-primary-900 text-sm font-semibold">
        Retour à Explorer
      </Link>
    </div>
  );

  const isSaved = ids.includes(memoire.id);
  const hasContacts = !!(memoire.facebook || memoire.linkedin || memoire.whatsapp);

  const handleToggle = () => {
    if (isPending) return;
    if (!session) {
      setShowAuth("bookmark");
      return;
    }
    toggle.mutate({ memoireId: memoire.id });
  };

  const handleContact = () => {
    if (isPending) return;
    if (!session) {
      setShowAuth("contact");
      return;
    }
    notifyContact.mutate({ memoireId: memoire.id });
    setShowContact(true);
  };

  return (
    <>
      <div className="grid lg:grid-cols-[1fr_300px] gap-8">
        <div>
          <div className={`relative ${compact ? "h-48 md:h-64" : "h-64 md:h-80"} rounded-2xl overflow-hidden mb-6`}>
            <Image src={memoire.image ?? "/images/projects/telecom.jpg"} alt={memoire.title} fill sizes="(max-width: 1024px) 100vw, 700px" className="object-cover" />
            <span className="absolute top-4 left-4 bg-primary-900/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
              {memoire.filiereName} · {memoire.niveau}
            </span>
          </div>

          <h1 className={`${compact ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl"} font-bold text-primary-900 dark:text-white font-heading mb-6 leading-tight`}>
            {memoire.title}
          </h1>

          {memoire.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {memoire.keywords.map((k) => (
                <span key={k} className="px-3 py-1 rounded-full bg-neutral-100 dark:bg-primary-800 text-xs text-primary-900 dark:text-white">
                  {k}
                </span>
              ))}
            </div>
          )}

          <h2 className="text-lg font-semibold text-primary-900 dark:text-white mb-3">Résumé</h2>
          <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-8 whitespace-pre-line">
            {memoire.summary}
          </p>

          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 p-5">
            <h2 className="text-sm font-semibold text-primary-900 dark:text-white mb-3">Conservation</h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              MemoRise référence uniquement les métadonnées. Le PDF complet est conservé par la Bibliothèque et Archives Universitaires (BAU).
            </p>
            <a href="https://biblio.univ-antananarivo.mg/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-primary-900 dark:text-white border border-neutral-200 dark:border-neutral-700 rounded-full px-4 py-2 hover:border-cta-500 transition-colors">
              Consulter la BAU
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-primary-900 p-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                <Image src={memoire.authorImage ?? "/images/authors/authors1.jpg"} alt={memoire.authorName ?? "Auteur"} fill sizes="48px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-neutral-500">Auteur</p>
                <p className="text-sm font-medium text-primary-900 dark:text-white truncate">{memoire.authorName}</p>
              </div>
            </div>

            <button onClick={handleContact} className="w-full inline-flex items-center justify-center gap-2 bg-cta-500 hover:bg-cta-400 text-primary-900 text-sm font-semibold rounded-full py-2.5 transition-colors">
              <MessageCircle className="w-4 h-4" />
              Contacter l&apos;auteur
            </button>
          </div>

          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-primary-900 p-5 space-y-4">
            <Row icon={<Calendar className="w-4 h-4" />} label="Année" value={String(memoire.annee)} />
            <Row icon={<GraduationCap className="w-4 h-4" />} label="Niveau" value={memoire.niveau} />
            <Row icon={<Building2 className="w-4 h-4" />} label="Mention" value={memoire.filiereName ?? ""} />
            {memoire.domaine && <Row icon={<Bookmark className="w-4 h-4" />} label="Domaine" value={memoire.domaine} />}
            <Row icon={<User className="w-4 h-4" />} label="Encadreur" value={memoire.encadreur} />
          </div>

          <button
            onClick={handleToggle}
            className={`w-full inline-flex items-center justify-center gap-2 border-2 rounded-full py-2.5 text-sm font-medium transition-colors ${
              isSaved
                ? "border-cta-500 bg-cta-500/10 text-primary-900 dark:text-cta-400"
                : "border-neutral-200 dark:border-neutral-700 text-primary-900 dark:text-white hover:border-cta-500"
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
            {isSaved ? "Enregistré" : "Enregistrer"}
          </button>
        </aside>
      </div>

      {showContact && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-primary-950/50 backdrop-blur-md" onClick={() => setShowContact(false)} />
          <div className="relative bg-white dark:bg-primary-900 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <button onClick={() => setShowContact(false)} className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:bg-neutral-100 dark:hover:bg-primary-800 transition-colors" aria-label="Fermer">
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-lg font-bold text-primary-900 dark:text-white font-heading mb-1">
              Contacter {memoire.authorName}
            </h2>
            <p className="text-sm text-neutral-500 mb-5">Choisissez un moyen de contact.</p>

            <div className="space-y-3">
              {memoire.facebook && <ContactLink href={formatExternalUrl(memoire.facebook)} label="Facebook" icon={<FacebookIcon className="w-5 h-5 text-[#1877F2]" />} />}
              {memoire.linkedin && <ContactLink href={formatExternalUrl(memoire.linkedin)} label="LinkedIn" icon={<LinkedinIcon className="w-5 h-5 text-[#0A66C2]" />} />}
              {memoire.whatsapp && (
                <ContactLink href={`https://wa.me/${formatWhatsAppNumber(memoire.whatsapp)}`} label="WhatsApp" icon={<WhatsappIcon className="w-5 h-5 text-[#25D366]" />} />
              )}
            </div>

            {!hasContacts && <p className="text-sm text-neutral-500">Aucun contact renseigné par l&apos;auteur.</p>}
          </div>
        </div>
      )}

      <AuthPromptModal
        open={showAuth === "bookmark"}
        onClose={() => setShowAuth(null)}
        title="Connexion requise"
        message="Créez un compte ou connectez-vous pour enregistrer ce mémoire dans vos favoris."
        redirectTo="/favoris"
        saveId={memoire.id}
      />
      <AuthPromptModal
        open={showAuth === "contact"}
        onClose={() => setShowAuth(null)}
        title="Connexion requise"
        message="Créez un compte ou connectez-vous pour contacter l'auteur de ce mémoire."
        redirectTo={`/memoires/${slug}`}
        contact
      />
    </>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-neutral-400 mt-0.5">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-neutral-500">{label}</p>
        <p className="text-sm text-primary-900 dark:text-white truncate">{value}</p>
      </div>
    </div>
  );
}

function ContactLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-cta-500 transition-colors text-sm font-medium text-primary-900 dark:text-white">
      <div className="flex items-center gap-3">
        {icon}
        {label}
      </div>
      <ExternalLink className="w-4 h-4 text-neutral-400" />
    </a>
  );
}