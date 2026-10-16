import { router } from "../init";
import { memoireRouter } from "./memoire";
import { favoriRouter } from "./favori";

export const appRouter = router({
  memoire: memoireRouter,
  favori: favoriRouter,
});

export type AppRouter = typeof appRouter;