"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type FavorisContextType = {
  favoris: string[];
  toggle: (id: string) => void;
};

const FavorisContext = createContext<FavorisContextType>({
  favoris: [],
  toggle: () => {},
});

export function FavorisProvider({ children }: { children: ReactNode }) {
  const [favoris, setFavoris] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("favoris");
    if (stored) setFavoris(JSON.parse(stored));
  }, []);

  const toggle = (id: string) => {
    const next = favoris.includes(id)
      ? favoris.filter((x) => x !== id)
      : [...favoris, id];
    setFavoris(next);
    localStorage.setItem("favoris", JSON.stringify(next));
  };

  return (
    <FavorisContext.Provider value={{ favoris, toggle }}>
      {children}
    </FavorisContext.Provider>
  );
}

export function useFavoris() {
  return useContext(FavorisContext);
}