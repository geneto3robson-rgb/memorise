"use client";

import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

export function Footer() {
  const { data: session } = authClient.useSession();
  const isConnected = !!session;

  return (
    <footer className="bg-primary-950 text-white pt-16 pb-8 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Logo et description */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image src="/logo.svg" alt="Logo MemoRise" width={32} height={32} unoptimized />
              <span className="text-lg font-bold font-heading">MemoRise</span>
            </Link>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Découvrez et explorez les mémoires de fin d&apos;études réalisés à l&apos;ESPA.
            </p>
          </div>

          {/* Liens Explorer */}
          <div>
            <h3 className="font-semibold text-white mb-4">Explorer</h3>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <Link href="/explorer" className="hover:text-cta-400 transition-colors">Tous les travaux</Link>
              </li>
              <li>
                <Link href="/explorer?filiere=TCO" className="hover:text-cta-400 transition-colors">Par filière</Link>
              </li>
              <li>
                <Link href="/explorer?annee=2026" className="hover:text-cta-400 transition-colors">Par année</Link>
              </li>
            </ul>
          </div>

          {/* Liens Plateforme */}
          <div>
            <h3 className="font-semibold text-white mb-4">Plateforme</h3>
            <ul className="space-y-2 text-sm text-neutral-400">
              {isConnected ? (
                <li>
                  <Link href="/tableau-de-bord" className="hover:text-cta-400 transition-colors">Mon espace</Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link href="/connexion" className="hover:text-cta-400 transition-colors">Se connecter</Link>
                  </li>
                  <li>
                    <Link href="/connexion?mode=signup" className="hover:text-cta-400 transition-colors">S&apos;inscrire</Link>
                  </li>
                </>
              )}
              <li>
                <Link href="/publier" className="hover:text-cta-400 transition-colors">Publier un mémoire</Link>
              </li>
            </ul>
          </div>

          {/* Liens Informations */}
          <div>
            <h3 className="font-semibold text-white mb-4">Informations</h3>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <Link href="/a-propos" className="hover:text-cta-400 transition-colors">À propos</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-cta-400 transition-colors">FAQ</Link>
              </li>
              <li>
                <Link href="/confidentialite" className="hover:text-cta-400 transition-colors">Confidentialité</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-cta-400 transition-colors">Contact</Link>
              </li>
              <li>
                <Link href="/mentions-legales" className="hover:text-cta-400 transition-colors">Mentions légales</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bas du footer */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} MemoRise. Tous droits réservés.</p>
          <p>École Supérieure Polytechnique d&apos;Antananarivo (ESPA)</p>
        </div>
      </div>
    </footer>
  );
}