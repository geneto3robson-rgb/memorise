"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { MemoireDetail } from "./MemoireDetail";

interface MemoireModalProps {
  slug: string | null;
  onClose: () => void;
}

export function MemoireModal({ slug, onClose }: MemoireModalProps) {
  useEffect(() => {
    if (!slug) return;

    const scrollY = window.scrollY;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      setTimeout(() => window.scrollTo(0, scrollY), 0);
    };
  }, [slug, onClose]);

  if (!slug) return null;

  return (
    /* 👇 CORRECTION : z-[80] devient z-80 👇 */
    <div className="fixed inset-0 z-80 flex items-center justify-center p-0 md:p-6">
      <div
        className="absolute inset-0 bg-primary-950/60 backdrop-blur-md"
        onClick={onClose}
      />
      {/* MODIFICATION : w-full h-full sur mobile pour prendre tout l'écran */}
      <div className="relative bg-white dark:bg-primary-950 w-full h-full md:h-auto md:max-w-5xl md:max-h-[92vh] md:rounded-3xl shadow-2xl overflow-y-auto">
        <button
          onClick={onClose}
          className="sticky top-4 float-right mr-4 z-10 p-2 rounded-full bg-white/90 dark:bg-primary-900/90 backdrop-blur border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-white hover:border-cta-500 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="px-6 md:px-10 py-8 md:py-10">
          <MemoireDetail slug={slug} compact />
        </div>
      </div>
    </div>
  );
}