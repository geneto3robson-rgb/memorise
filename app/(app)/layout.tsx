import { Sidebar, AppHeader } from "@/components/layout/AppShell";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // modifier le layout pour inclure le Sidebar et l'AppHeader
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-primary-950">
      <Sidebar />
      <div className="lg:pl-60">
        <AppHeader />
        <main className="px-4 md:px-8 py-6 pb-24 lg:pb-10 ">{children}</main>
      </div>
    </div>
  );
}