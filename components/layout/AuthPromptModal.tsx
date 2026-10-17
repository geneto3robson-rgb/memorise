"use client";

import Link from "next/link";
import { X, Lock } from "lucide-react";

interface AuthPromptModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  redirectTo?: string;
  saveId?: number;
  contact?: boolean;
}

export function AuthPromptModal({
  open,
  onClose,
  title,
  message,
  redirectTo,
  saveId,
  contact,
}: AuthPromptModalProps) {
  if (!open) return null;

  const params = new URLSearchParams();
  if (redirectTo) params.set("redirect", redirectTo);
  if (saveId !== undefined) params.set("save", String(saveId));
  if (contact) params.set("contact", "1");

  const target = `/connexion${params.toString() ? "?" + params.toString() : ""}`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-primary-950/50 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-primary-900 rounded-2xl shadow-2xl max-w-sm w-full p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:bg-neutral-100 dark:hover:bg-primary-800 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-full bg-cta-500/20 flex items-center justify-center mb-4">
          <Lock className="w-5 h-5 text-primary-900 dark:text-cta-400" />
        </div>

        <h2 className="text-lg font-bold text-primary-900 dark:text-white font-heading mb-2">
          {title}
        </h2>
        <p className="text-sm text-neutral-500 mb-6">{message}</p>

        <div className="flex flex-col gap-2">
          <Link
            href={target}
            className="w-full inline-flex items-center justify-center bg-cta-500 hover:bg-cta-400 text-primary-900 text-sm font-semibold rounded-full py-2.5 transition-colors"
          >
            Se connecter
          </Link>
          <button
            onClick={onClose}
            className="w-full text-sm text-neutral-500 hover:text-primary-900 dark:hover:text-white transition-colors py-2"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}