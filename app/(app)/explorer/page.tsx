import { Suspense } from "react";
import ExplorerClient from "./ExplorerClient";

export default function ExplorerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#f7faf9] dark:bg-primary-950">
        <p className="text-primary-600 font-medium">Chargement de l'explorateur...</p>
      </div>
    }>
      <ExplorerClient />
    </Suspense>
  );
}