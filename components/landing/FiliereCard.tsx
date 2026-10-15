import Link from "next/link";
import { Filiere } from "@/lib/data/filieres";

interface FiliereCardProps {
  filiere: Filiere;
}

export function FiliereCard({ filiere }: FiliereCardProps) {
  const Icon = filiere.icon;

  return (
    <Link
      href={filiere.href}
      className="group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-neutral-200 dark:border-neutral-700 bg-white dark:bg-primary-900 hover:border-cta-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
    >
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-primary-800 group-hover:bg-cta-100 dark:group-hover:bg-cta-500 transition-colors">
        <Icon className="w-6 h-6 text-primary-900 dark:text-white group-hover:text-primary-900 transition-colors" />
      </div>
      <span className="text-sm font-medium text-center text-primary-900 dark:text-white">
        {filiere.name}
      </span>
    </Link>
  );
}