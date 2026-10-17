import Link from "next/link";

export function AppFooter() {
  return (
    <footer className="mt-16 pt-8 pb-6 border-t border-neutral-200 dark:border-neutral-800">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
        <p>© 2026 MemoRise. Tous droits réservés.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/mentions-legales" className="hover:text-cta-600 transition-colors">
            Mentions légales
          </Link>
          <Link href="/confidentialite" className="hover:text-cta-600 transition-colors">
            Confidentialité
          </Link>
          <Link href="/contact" className="hover:text-cta-600 transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}