import { z } from "zod";
import { and, eq, desc } from "drizzle-orm";
import { protectedProcedure, router } from "../init";
import { db } from "@/db";
import { favoris, memoires, filieres } from "@/db/schema";
import { user } from "@/db/auth-schema";

export const favoriRouter = router({
  ids: protectedProcedure.query(async ({ ctx }) => {
    const rows = await db
      .select({ memoireId: favoris.memoireId })
      .from(favoris)
      .where(eq(favoris.userId, ctx.session.user.id));
    return rows.map((r) => r.memoireId);
  }),

  list: protectedProcedure.query(async ({ ctx }) => {
    return db
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
        authorName: user.name,
        authorImage: user.image,
      })
      .from(favoris)
      .leftJoin(memoires, eq(favoris.memoireId, memoires.id))
      .leftJoin(filieres, eq(memoires.filiereId, filieres.id))
      .leftJoin(user, eq(memoires.userId, user.id))
      .where(eq(favoris.userId, ctx.session.user.id))
      .orderBy(desc(favoris.createdAt));
  }),

  toggle: protectedProcedure
    .input(z.object({ memoireId: z.number().int() }))
    .mutation(async ({ input, ctx }) => {
      const existing = await db
        .select()
        .from(favoris)
        .where(
          and(
            eq(favoris.userId, ctx.session.user.id),
            eq(favoris.memoireId, input.memoireId)
          )
        );

      if (existing.length > 0) {
        await db
          .delete(favoris)
          .where(
            and(
              eq(favoris.userId, ctx.session.user.id),
              eq(favoris.memoireId, input.memoireId)
            )
          );
        return { saved: false };
      }

      await db.insert(favoris).values({
        userId: ctx.session.user.id,
        memoireId: input.memoireId,
      });
      return { saved: true };
    }),
});