import { Suspense } from "react";
import PublierClient from "./PublierClient";

export default function PublierPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#f7faf9] dark:bg-primary-950">
        <p className="text-primary-600 font-medium">Chargement du formulaire...</p>
      </div>
    }>
      <PublierClient />
    </Suspense>
  );
}