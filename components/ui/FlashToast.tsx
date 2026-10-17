"use client";

import Link from "next/link";
import { CheckCircle, X } from "lucide-react";

interface FlashToastProps {
  text: string;
  link: string;
  linkText: string;
  onClose: () => void;
}

export function FlashToast({
  text,
  link,
  linkText,
  onClose,
}: FlashToastProps) {
  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md">
      <div className="flex items-start gap-3 rounded-2xl bg-primary-500 dark:bg-cta-500 text-white dark:text-primary-900 p-4 shadow-2xl">
        <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="flex-1 text-sm leading-relaxed">
          {text}{" "}
          <Link
            href={link}
            onClick={onClose}
            className="font-bold hover:underline"
          >
            {linkText}
          </Link>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="opacity-70 hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}