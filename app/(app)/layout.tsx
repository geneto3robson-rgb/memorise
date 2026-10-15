"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar, AppHeader } from "@/components/layout/AppShell";
import { authClient } from "@/lib/auth-client";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/connexion");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center text-neutral-500">
        Chargement…
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-primary-950">
      <Sidebar />
      <div className="lg:pl-60">
        <AppHeader />
        <main className="px-4 md:px-8 py-6 pb-24 lg:pb-10">{children}</main>
      </div>
    </div>
  );
}