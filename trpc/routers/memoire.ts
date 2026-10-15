import { z } from "zod";
import { publicProcedure, router } from "../init";
import { db } from "@/db";
import { memoires, filieres, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const memoireRouter = router({
  list: publicProcedure
    .input(
      z.object({
        search: z.string().default(""),
        filiere: z.string().default(""),
        niveau: z.string().default(""),
        annee: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      const rows = await db
        .select({
          id: memoires.id,
          slug: memoires.slug,
          title: memoires.title,
          summary: memoires.summary,
          image: memoires.image,
          annee: memoires.annee,
          niveau: memoires.niveau,
          encadreur: memoires.encadreur,
          filiereName: filieres.name,
          filiereCode: filieres.code,
          authorName: users.name,
          authorImage: users.image,
        })
        .from(memoires)
        .leftJoin(filieres, eq(memoires.filiereId, filieres.id))
        .leftJoin(users, eq(memoires.userId, users.id));

      return rows.filter((r) => {
        const q = input.search.toLowerCase().trim();
        if (q && !r.title.toLowerCase().includes(q)) return false;
        if (input.filiere && r.filiereCode !== input.filiere) return false;
        if (input.niveau && r.niveau !== input.niveau) return false;
        if (input.annee && r.annee !== input.annee) return false;
        return true;
      });
    }),
});