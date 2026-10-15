import { router } from "../init";
import { memoireRouter } from "./memoire";

export const appRouter = router({
  memoire: memoireRouter,
});

export type AppRouter = typeof appRouter;