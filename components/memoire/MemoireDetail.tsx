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

  useEffect(() => {
    if (session && searchParams.get("contact") === "1") {
      setShowContact(true);
    }
  }, [session, searchParams]);

  if (isLoading) {
    return <p className="text-center text-neutral-500 py-12">Chargement…</p>;
  }

  if (!memoire) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-primary-900 dark:text-white font-heading mb-3">
          Mémoire introuvable
        </h2>
        <Link
          href="/explorer"
          className="inline-block px-5 py-2 rounded-full bg-cta-500 hover:bg-cta-400 text-primary-900 text-sm font-semibold"
        >
          Retour à Explorer
        </Link>
      </div>
    );
  }

  const isSaved = ids.includes(memoire.id);
  const contacts = memoire.contacts;
  const hasContacts = !!(contacts?.facebook || contacts?.linkedin || contacts?.whatsapp);

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
    setShowContact(true);
  };

  return (
    <>
      <div className="grid lg:grid-cols-[1fr_300px] gap-8">
        <div>
          <div className={`relative ${compact ? "h-48 md:h-64" : "h-64 md:h-80"} rounded-2xl overflow-hidden mb-6`}>
            <Image
              src={memoire.image ?? "/images/projects/telecom.jpg"}
              alt={memoire.title}
              fill
              sizes="(max-width: 1024px) 100vw, 700px"
              className="object-cover"
            />
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
                <span
                  key={k}
                  className="px-3 py-1 rounded-full bg-neutral-100 dark:bg-primary-800 text-xs text-primary-900 dark:text-white"
                >
                  {k}
                </span>
              ))}
            </div>
          )}

          <h2 className="text-lg font-semibold text-primary-900 dark:text-white mb-3">
            Résumé
          </h2>
          <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-8 whitespace-pre-line">
            {memoire.summary}
          </p>

          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 p-5">
            <h2 className="text-sm font-semibold text-primary-900 dark:text-white mb-3">
              Conservation
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              MemoRise référence uniquement les métadonnées. Le PDF complet est
              conservé par la Bibliothèque et Archives Universitaires (BAU).
            </p>
            <a
              href="https://biblio.univ-antananarivo.mg/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary-900 dark:text-white border border-neutral-200 dark:border-neutral-700 rounded-full px-4 py-2 hover:border-cta-500 transition-colors"
            >
              Consulter la BAU
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-primary-900 p-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                <Image
                  src={memoire.authorImage ?? "/images/authors/authors1.jpg"}
                  alt={memoire.authorName ?? "Auteur"}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-neutral-500">Auteur</p>
                <p className="text-sm font-medium text-primary-900 dark:text-white truncate">
                  {memoire.authorName}
                </p>
              </div>
            </div>

            <button
              onClick={handleContact}
              className="w-full inline-flex items-center justify-center gap-2 bg-cta-500 hover:bg-cta-400 text-primary-900 text-sm font-semibold rounded-full py-2.5 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Contacter l&apos;auteur
            </button>
          </div>

          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-primary-900 p-5 space-y-4">
            <Row icon={<Calendar className="w-4 h-4" />} label="Année" value={String(memoire.annee)} />
            <Row icon={<GraduationCap className="w-4 h-4" />} label="Niveau" value={memoire.niveau} />
            <Row icon={<Building2 className="w-4 h-4" />} label="Filière" value={memoire.filiereName ?? ""} />
            {memoire.domaine && (
              <Row icon={<Bookmark className="w-4 h-4" />} label="Domaine" value={memoire.domaine} />
            )}
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
          <div
            className="absolute inset-0 bg-primary-950/50 backdrop-blur-md"
            onClick={() => setShowContact(false)}
          />
          <div className="relative bg-white dark:bg-primary-900 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <button
              onClick={() => setShowContact(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:bg-neutral-100 dark:hover:bg-primary-800 transition-colors"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-lg font-bold text-primary-900 dark:text-white font-heading mb-1">
              Contacter {memoire.authorName}
            </h2>
            <p className="text-sm text-neutral-500 mb-5">
              Choisissez un moyen de contact.
            </p>

            <div className="space-y-3">
              {contacts?.facebook && <ContactLink href={contacts.facebook} label="Facebook" />}
              {contacts?.linkedin && <ContactLink href={contacts.linkedin} label="LinkedIn" />}
              {contacts?.whatsapp && (
                <ContactLink
                  href={`https://wa.me/${contacts.whatsapp.replace(/\D/g, "")}`}
                  label="WhatsApp"
                />
              )}
            </div>

            {!hasContacts && (
              <p className="text-sm text-neutral-500">
                Aucun contact renseigné par l&apos;auteur.
              </p>
            )}
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

function ContactLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-cta-500 transition-colors text-sm font-medium text-primary-900 dark:text-white"
    >
      {label}
      <ExternalLink className="w-4 h-4 text-neutral-400" />
    </a>
  );
}