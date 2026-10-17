"use client";

import { useParams, useRouter } from "next/navigation";
import { X } from "lucide-react";
import { MemoireDetail } from "@/components/memoire/MemoireDetail";

export default function MemoireDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = String(params.slug ?? "");

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-0 md:p-6 bg-primary-950/60 backdrop-blur-md">
      <div className="relative bg-white dark:bg-primary-950 w-full h-full md:h-auto md:max-w-5xl md:max-h-[92vh] md:rounded-3xl shadow-2xl overflow-y-auto">
        <button
          onClick={() => router.push("/explorer")}
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