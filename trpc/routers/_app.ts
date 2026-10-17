import { router } from "../init";
import { memoireRouter } from "./memoire";
import { favoriRouter } from "./favori";
import { notificationRouter } from "./notification";
import { profileRouter } from "./profile";

export const appRouter = router({
  memoire: memoireRouter,
  favori: favoriRouter,
  notification: notificationRouter,
  profile: profileRouter,
});

export type AppRouter = typeof appRouter;