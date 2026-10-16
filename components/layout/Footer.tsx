import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";

export function Footer() {
  return (
    <footer className="bg-primary-900 dark:bg-primary-950 text-white">
      <Container className="pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <Image
                src="/logo.svg"
                alt="Logo MemoRise"
                width={36}
                height={36}
              />
              <span className="text-xl font-bold font-heading">MemoRise</span>
            </Link>
            <p className="text-sm text-white/70">
              Decouvrez les mémoires de l'ESPA.
            </p>
          </div>

          <FooterColumn
            title="Explorer"
            links={[
              { label: "Tous les travaux", href: "/explorer" },
              { label: "Par filière", href: "/filieres" },
              { label: "Par année", href: "/annees" },
            ]}
          />

          <FooterColumn
            title="Plateforme"
            links={[
              { label: "Publier mon mémoire", href: "/publier" },
              { label: "Se connecter", href: "/connexion" },
              { label: "S'inscrire", href: "/inscription" },
              { label: "A propos", href: "/a-propos" },
            ]}
          />

          <FooterColumn
            title="Informations"
            links={[
              { label: "FAQ", href: "/faq" },
              { label: "Mentions légales", href: "/mentions-legales" },
              { label: "Confidentialité", href: "/confidentialite" },
              { label: "Contact", href: "/contact" },
            ]}
          />
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between gap-4 text-sm text-white/60">
          <p>2026 MemoRise. Tous droits réservés.</p>
          <p>Ecole Supérieure Polytechnique d'Antananarivo (ESPA)</p>
        </div>
      </Container>
    </footer>
  );
}

interface FooterColumnProps {
  title: string;
  links: { label: string; href: string }[];
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <h3 className="font-semibold text-white mb-4">{title}</h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-white/70 hover:text-cta-500 transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
