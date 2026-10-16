"use client";

import { useState } from "react";
import Image from "next/image";
import { User, Lock, Bell, Palette, Shield, Moon, Sun } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { filieres } from "@/lib/data/filieres";
import { useTheme } from "@/lib/theme-context";

const inputClass =
  "w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-primary-950 text-primary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cta-500";
const labelClass = "block text-xs font-medium text-neutral-500 mb-1.5";
const btnPrimary =
  "px-6 py-2.5 rounded-full bg-cta-500 hover:bg-cta-400 text-primary-900 text-sm font-semibold transition-colors";

const roles = ["Étudiant actuel", "Ancien étudiant", "Enseignant"];

const sections = [
  { id: "profil", label: "Informations personnelles", icon: User },
  { id: "securite", label: "Sécurité et connexion", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "affichage", label: "Préférences d'affichage", icon: Palette },
  { id: "confidentialite", label: "Confidentialité et compte", icon: Shield },
] as const;

type SectionId = (typeof sections)[number]["id"];

export default function ParametresPage() {
  const { theme, toggle } = useTheme();
  const [active, setActive] = useState<SectionId>("profil");
  const [nom, setNom] = useState("ANDRIANINA Herry Flavina");
  const [role, setRole] = useState(roles[0]);

  return (
    <Container className="py-10 md:py-14">
      <div className="w-16 h-1 bg-cta-500 mb-4 rounded-full" />
      <h1 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-white font-heading mb-8">
        Paramètres
      </h1>

      <div className="grid lg:grid-cols-[300px_1fr] gap-6">
        <aside className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-primary-900 overflow-hidden h-fit">
          <div className="p-6 text-center border-b border-neutral-200 dark:border-neutral-700">
            <div className="relative w-20 h-20 mx-auto mb-3">
              <Image
                src="/images/authors/authors1.jpg"
                alt={nom}
                fill
                sizes="80px"
                className="rounded-full object-cover"
              />
            </div>
            <p className="font-semibold text-primary-900 dark:text-white text-sm">{nom}</p>
            <p className="text-xs text-neutral-500 mt-0.5">{role}</p>
          </div>

          <nav className="p-2">
            {sections.map((s) => {
              const Icon = s.icon;
              const isActive = active === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left transition-colors ${
                    isActive
                      ? "bg-cta-500 text-primary-900"
                      : "text-primary-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-primary-800"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {s.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <section className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-primary-900 p-6 md:p-8">
          {active === "profil" && (
            <ProfilSection
              nom={nom}
              setNom={setNom}
              role={role}
              setRole={setRole}
            />
          )}
          {active === "securite" && <SecuriteSection />}
          {active === "notifications" && <NotificationsSection />}
          {active === "affichage" && <AffichageSection theme={theme} toggle={toggle} />}
          {active === "confidentialite" && <ConfidentialiteSection />}
        </section>
      </div>
    </Container>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="mb-6">
      <h2 className="text-lg font-semibold text-primary-900 dark:text-white">{title}</h2>
      <p className="text-xs text-neutral-500 mt-1">{subtitle}</p>
    </header>
  );
}

function ProfilSection({
  nom,
  setNom,
  role,
  setRole,
}: {
  nom: string;
  setNom: (v: string) => void;
  role: string;
  setRole: (v: string) => void;
}) {
  const [filiere, setFiliere] = useState("TCO");
  const [parcours, setParcours] = useState("");
  const [facebook, setFacebook] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  return (
    <>
      <SectionTitle title="Informations personnelles" subtitle="Gérer les informations du profil." />
      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 shrink-0">
            <Image
              src="/images/authors/authors1.jpg"
              alt={nom}
              fill
              sizes="64px"
              className="rounded-full object-cover"
            />
          </div>
          <label className="cursor-pointer text-sm font-medium text-primary-900 dark:text-white border border-neutral-200 dark:border-neutral-700 rounded-full px-4 py-2 hover:border-cta-500 transition-colors">
            Changer la photo
            <input type="file" accept="image/*" className="hidden" />
          </label>
        </div>

        <div>
          <label className={labelClass}>Nom et prénom</label>
          <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Adresse e-mail</label>
          <input
            type="email"
            value="herry@espa.mg"
            readOnly
            className={inputClass + " opacity-70 cursor-not-allowed"}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Filière</label>
            <select value={filiere} onChange={(e) => setFiliere(e.target.value)} className={inputClass}>
              {filieres.map((f) => (
                <option key={f.id} value={f.code}>{f.code} — {f.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Parcours</label>
            <input
              type="text"
              value={parcours}
              onChange={(e) => setParcours(e.target.value)}
              placeholder="Ex : STI"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Statut</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} className={inputClass}>
            {roles.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Contacts (facultatif)</label>
          <div className="space-y-3">
            <input
              type="text"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              placeholder="Lien Facebook"
              className={inputClass}
            />
            <input
              type="text"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="Lien LinkedIn"
              className={inputClass}
            />
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="Numéro WhatsApp"
              className={inputClass}
            />
          </div>
          <p className="text-xs text-neutral-500 mt-2">
            Ces informations seront visibles sur vos fiches de mémoire publiées.
          </p>
        </div>

        <div className="flex justify-end pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <button type="submit" className={btnPrimary}>Modifier le profil</button>
        </div>
      </form>
    </>
  );
}

function SecuriteSection() {
  return (
    <>
      <SectionTitle title="Sécurité et connexion" subtitle="Protéger l'accès au compte." />
      <div className="space-y-5">
        <div>
          <label className={labelClass}>Adresse e-mail du compte</label>
          <input
            type="email"
            value="herry@espa.mg"
            readOnly
            className={inputClass + " opacity-70 cursor-not-allowed"}
          />
        </div>

        <div className="space-y-3">
          <label className={labelClass}>Modifier le mot de passe</label>
          <input type="password" placeholder="Mot de passe actuel" className={inputClass} />
          <input type="password" placeholder="Nouveau mot de passe" className={inputClass} />
          <input type="password" placeholder="Confirmer le nouveau mot de passe" className={inputClass} />
        </div>

        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700 space-y-4">
          <button type="button" className={btnPrimary}>Modifier le mot de passe</button>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-neutral-500">Déconnecter cet appareil.</p>
            <button
              type="button"
              className="px-5 py-2 rounded-full border-2 border-error-200 dark:border-error-800 text-error-600 dark:text-error-400 text-sm font-medium hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors"
            >
              Déconnexion de la session
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function NotificationsSection() {
  const [news, setNews] = useState(true);
  const [publis, setPublis] = useState(true);
  return (
    <>
      <SectionTitle title="Notifications" subtitle="Choisir les communications à recevoir." />
      <div className="space-y-4">
        <label className="flex items-center justify-between gap-4 cursor-pointer">
          <span className="text-sm text-primary-900 dark:text-white">Recevoir les actualités de MemoRise</span>
          <input type="checkbox" checked={news} onChange={(e) => setNews(e.target.checked)} className="w-5 h-5 accent-cta-500" />
        </label>
        <label className="flex items-center justify-between gap-4 cursor-pointer">
          <span className="text-sm text-primary-900 dark:text-white">Recevoir les notifications concernant ses publications</span>
          <input type="checkbox" checked={publis} onChange={(e) => setPublis(e.target.checked)} className="w-5 h-5 accent-cta-500" />
        </label>
      </div>
    </>
  );
}

function AffichageSection({ theme, toggle }: { theme: string; toggle: () => void }) {
  return (
    <>
      <SectionTitle title="Préférences d'affichage" subtitle="Personnaliser l'interface." />
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-primary-900 dark:text-white">
              Thème {theme === "dark" ? "sombre" : "clair"}
            </p>
            <p className="text-xs text-neutral-500">Basculer entre clair et sombre.</p>
          </div>
          <button
            onClick={toggle}
            aria-label="Changer de thème"
            className="p-3 rounded-full border border-neutral-200 dark:border-neutral-700 text-primary-900 dark:text-white hover:border-cta-500 transition-colors"
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
        </div>

        <div>
          <label className={labelClass}>Langue de l&apos;interface</label>
          <select defaultValue="fr" className={inputClass}>
            <option value="fr">Français</option>
          </select>
        </div>
      </div>
    </>
  );
}

function ConfidentialiteSection() {
  const [confirming, setConfirming] = useState(false);
  return (
    <>
      <SectionTitle title="Confidentialité et compte" subtitle="Gérer la confidentialité et la suppression du compte." />
      <div className="space-y-3">
        <a href="/confidentialite" className="block text-sm text-primary-900 dark:text-white hover:text-cta-600 transition-colors">
          Politique de confidentialité
        </a>
        <a href="/conditions" className="block text-sm text-primary-900 dark:text-white hover:text-cta-600 transition-colors">
          Conditions d&apos;utilisation
        </a>
      </div>

      <div className="mt-8 pt-6 border-t border-error-200 dark:border-error-800">
        <p className="text-xs text-error-600 dark:text-error-400 mb-3">
          La suppression du compte est définitive. Vos publications et favoris seront perdus.
        </p>
        {!confirming ? (
          <button
            onClick={() => setConfirming(true)}
            className="px-5 py-2.5 rounded-full border-2 border-error-500 text-error-500 text-sm font-medium hover:bg-error-500 hover:text-white transition-colors"
          >
            Supprimer mon compte
          </button>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-error-600 dark:text-error-400">Confirmer la suppression ?</span>
            <button className="px-4 py-2 rounded-full bg-error-500 hover:bg-error-600 text-white text-sm font-medium transition-colors">
              Oui, supprimer
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="px-4 py-2 rounded-full border border-neutral-300 dark:border-neutral-700 text-sm text-primary-900 dark:text-white hover:border-primary-900 transition-colors"
            >
              Annuler
            </button>
          </div>
        )}
      </div>
    </>
  );
}