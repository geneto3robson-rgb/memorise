import Link from "next/link";
import { FileQuestion, ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#f7faf9] dark:bg-primary-950 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 bg-cta-500/20 rounded-full animate-ping" />
          <div className="relative w-full h-full bg-white dark:bg-primary-900 rounded-full flex items-center justify-center shadow-lg border border-neutral-200 dark:border-neutral-700">
            <FileQuestion className="w-12 h-12 text-cta-500" />
          </div>
        </div>

        <h1 className="text-6xl font-black text-primary-950 dark:text-white font-heading mb-4 tracking-tighter">
          404
        </h1>
        <h2 className="text-2xl font-bold text-primary-900 dark:text-white font-heading mb-4">
          Page introuvable
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
          Désolé, il semblerait que vous ayez suivi un lien brisé ou que cette page ait été déplacée. Pas de panique, vous pouvez revenir en arrière !
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/" 
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-primary-950 dark:bg-primary-800 text-white text-sm font-semibold rounded-full hover:bg-primary-800 dark:hover:bg-primary-700 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
          </Link>
          <Link 
            href="/explorer" 
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-cta-500 text-primary-950 text-sm font-semibold rounded-full hover:bg-cta-400 transition-colors shadow-sm"
          >
            <Compass className="w-4 h-4" /> Explorer les mémoires
          </Link>
        </div>
      </div>
    </main>
  );
}