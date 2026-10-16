"use client";

import { authClient } from "@/lib/auth-client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Sidebar, AppHeader } from "@/components/layout/AppShell";
import { AppFooter } from "@/components/layout/AppFooter";

export default function ExplorerLayout({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center text-neutral-500">
        Chargement…
      </div>
    );
  }

  if (session) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-primary-950">
        <Sidebar />
        <div className="lg:pl-60">
          <AppHeader />
          <main className="px-4 md:px-8 py-6 pb-24 lg:pb-10">
            {children}
            <AppFooter />
          </main>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-20">{children}</main>
      <Footer />
    </>
  );
}