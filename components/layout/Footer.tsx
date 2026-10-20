import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-[#0A1E1E] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* 👇 GRILLE PRINCIPALE : 2 colonnes sur mobile, 4 sur PC 👇 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          
          {/* Colonne Logo & Description (Prend toute la largeur sur mobile) */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.svg" alt="MemoRise" width={32} height={32} />
              <span className="text-xl font-bold font-heading">MemoRise</span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              Découvrez et explorez les mémoires de fin d'études réalisés à l'ESPA.
            </p>
          </div>

          {/* Colonne 1 : Explorer */}
          <div>
            <h3 className="font-bold text-lg mb-4">Explorer</h3>
            <ul className="space-y-3 text-sm text-white/60">
              <li><Link href="/explorer" className="hover:text-[#CEEC22] transition-colors">Tous les travaux</Link></li>
              <li><Link href="/explorer?filiere=TCO" className="hover:text-[#CEEC22] transition-colors">Par filière</Link></li>
              <li><Link href="/explorer?annee=2026" className="hover:text-[#CEEC22] transition-colors">Par année</Link></li>
            </ul>
          </div>

          {/* Colonne 2 : Plateforme */}
          <div>
            <h3 className="font-bold text-lg mb-4">Plateforme</h3>
            <ul className="space-y-3 text-sm text-white/60">
              <li><Link href="/connexion" className="hover:text-[#CEEC22] transition-colors">Se connecter</Link></li>
              <li><Link href="/connexion?mode=signup" className="hover:text-[#CEEC22] transition-colors">S'inscrire</Link></li>
              <li><Link href="/publier" className="hover:text-[#CEEC22] transition-colors">Publier un mémoire</Link></li>
            </ul>
          </div>

          {/* Colonne 3 : Informations (Se place en dessous sur mobile) */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-bold text-lg mb-4">Informations</h3>
            <ul className="grid grid-cols-2 md:flex md:flex-col gap-3 text-sm text-white/60">
              <li><Link href="/a-propos" className="hover:text-[#CEEC22] transition-colors">À propos</Link></li>
              <li><Link href="/faq" className="hover:text-[#CEEC22] transition-colors">FAQ</Link></li>
              <li><Link href="/confidentialite" className="hover:text-[#CEEC22] transition-colors">Confidentialité</Link></li>
              <li><Link href="/contact" className="hover:text-[#CEEC22] transition-colors">Contact</Link></li>
              <li><Link href="/mentions-legales" className="hover:text-[#CEEC22] transition-colors">Mentions légales</Link></li>
            </ul>
          </div>

        </div>

        {/* Bas du footer (Copyright) */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs md:text-sm text-white/40">
          <p>© {new Date().getFullYear()} MemoRise. Tous droits réservés.</p>
          <p>École Supérieure Polytechnique d'Antananarivo (ESPA)</p>
        </div>

      </div>
    </footer>
  );
}