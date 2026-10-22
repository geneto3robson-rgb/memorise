import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-primary-950 text-white pt-16 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.svg" alt="MemoRise" width={32} height={32} />
              <span className="text-xl font-bold font-heading">MemoRise</span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              Découvrez et explorez les mémoires de fin d'études réalisés à l'ESPA.
            </p>
            
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-[10px] uppercase tracking-widest text-white/40 mb-3 font-bold">En partenariat avec</p>
              <a 
                href="https://www.espa.mg" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-white p-1 rounded-full hover:scale-105 transition-transform shadow-md"
                title="École Supérieure Polytechnique d'Antananarivo"
              >
                {/* CORRECTION DU CHEMIN DE L'IMAGE ICI */}
                <Image 
                  src="/images/Logo ESPA.jpeg" // Vérifiez bien le nom exact de votre fichier (majuscules, espaces, extension)
                  alt="Logo ESPA" 
                  width={60} 
                  height={60} 
                  className="object-contain rounded-full" 
                  unoptimized 
                />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Explorer</h3>
            <ul className="space-y-3 text-sm text-white/60">
              <li><Link href="/explorer" className="hover:text-cta-500 transition-colors">Tous les travaux</Link></li>
              <li><Link href="/explorer?filiere=TCO" className="hover:text-cta-500 transition-colors">Par mention</Link></li>
              <li><Link href="/explorer?annee=2026" className="hover:text-cta-500 transition-colors">Par année</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Plateforme</h3>
            <ul className="space-y-3 text-sm text-white/60">
              <li><Link href="/connexion" className="hover:text-cta-500 transition-colors">Se connecter</Link></li>
              <li><Link href="/connexion?mode=signup" className="hover:text-cta-500 transition-colors">S'inscrire</Link></li>
              <li><Link href="/publier" className="hover:text-cta-500 transition-colors">Publier un mémoire</Link></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h3 className="font-bold text-lg mb-4">Informations</h3>
            <ul className="grid grid-cols-2 md:flex md:flex-col gap-3 text-sm text-white/60">
              <li><Link href="/a-propos" className="hover:text-cta-500 transition-colors">À propos</Link></li>
              <li><Link href="/faq" className="hover:text-cta-500 transition-colors">FAQ</Link></li>
              <li><Link href="/confidentialite" className="hover:text-cta-500 transition-colors">Confidentialité</Link></li>
              <li><Link href="/contact" className="hover:text-cta-500 transition-colors">Contact</Link></li>
              <li><Link href="/mentions-legales" className="hover:text-cta-500 transition-colors">Mentions légales</Link></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs md:text-sm text-white/40 text-center md:text-left">
          <p>© {new Date().getFullYear()} MemoRise. Tous droits réservés.</p>
          <p>École Supérieure Polytechnique d'Antananarivo (ESPA)</p>
        </div>

      </div>
    </footer>
  );
}