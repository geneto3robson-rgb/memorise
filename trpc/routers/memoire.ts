import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq, sql, desc } from "drizzle-orm";
import { publicProcedure, protectedProcedure, router } from "../init";
import { db } from "@/db";
import { memoires, filieres, keywords, memoireKeywords, profiles } from "@/db/schema";
import { user } from "@/db/auth-schema";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

export const memoireRouter = router({
  myProfile: protectedProcedure.query(async ({ ctx }) => {
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, ctx.session.user.id));
    return profile ?? null;
  }),

  list: publicProcedure
    .input(
      z.object({
        search: z.string().default(""),
        filiere: z.string().default(""),
        domaine: z.string().default(""),
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
          domaine: memoires.domaine,
          filiereName: filieres.name,
          filiereCode: filieres.code,
          authorName: user.name,
          authorImage: user.image,
        })
        .from(memoires)
        .leftJoin(filieres, eq(memoires.filiereId, filieres.id))
        .leftJoin(user, eq(memoires.userId, user.id))
        .orderBy(desc(memoires.createdAt));

      return rows.filter((r) => {
        const q = input.search.toLowerCase().trim();
        if (q && !r.title.toLowerCase().includes(q)) return false;
        if (input.filiere && r.filiereCode !== input.filiere) return false;
        if (input.domaine && r.domaine !== input.domaine) return false;
        if (input.niveau && r.niveau !== input.niveau) return false;
        if (input.annee && r.annee !== input.annee) return false;
        return true;
      });
    }),

  recent: publicProcedure.query(async () => {
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
        domaine: memoires.domaine,
        filiereName: filieres.name,
        filiereCode: filieres.code,
        authorName: user.name,
        authorImage: user.image,
      })
      .from(memoires)
      .leftJoin(filieres, eq(memoires.filiereId, filieres.id))
      .leftJoin(user, eq(memoires.userId, user.id))
      .orderBy(desc(memoires.createdAt))
      .limit(4);

    return rows;
  }),

  mine: protectedProcedure.query(async ({ ctx }) => {
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
        domaine: memoires.domaine,
        filiereName: filieres.name,
        filiereCode: filieres.code,
        createdAt: memoires.createdAt,
      })
      .from(memoires)
      .leftJoin(filieres, eq(memoires.filiereId, filieres.id))
      .where(eq(memoires.userId, ctx.session.user.id))
      .orderBy(desc(memoires.createdAt));

    return rows;
  }),

  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const [row] = await db
        .select({
          id: memoires.id,
          slug: memoires.slug,
          title: memoires.title,
          summary: memoires.summary,
          image: memoires.image,
          annee: memoires.annee,
          niveau: memoires.niveau,
          encadreur: memoires.encadreur,
          domaine: memoires.domaine,
          parcours: memoires.parcours,
          facebook: memoires.facebook,
          linkedin: memoires.linkedin,
          whatsapp: memoires.whatsapp,
          filiereName: filieres.name,
          filiereCode: filieres.code,
          authorName: user.name,
          authorImage: user.image,
          authorId: user.id,
        })
        .from(memoires)
        .leftJoin(filieres, eq(memoires.filiereId, filieres.id))
        .leftJoin(user, eq(memoires.userId, user.id))
        .where(eq(memoires.slug, input.slug));

      if (!row) return null;

      const kws = await db
        .select({ name: keywords.name })
        .from(memoireKeywords)
        .leftJoin(keywords, eq(memoireKeywords.keywordId, keywords.id))
        .where(eq(memoireKeywords.memoireId, row.id));

      return {
        ...row,
        keywords: kws.map((k) => k.name ?? "").filter(Boolean),
      };
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(3),
        summary: z.string().min(10),
        filiereCode: z.string().min(1),
        domaine: z.string().optional(),
        parcours: z.string().optional(),
        niveau: z.string().min(1),
        annee: z.number().int().min(1900).max(new Date().getFullYear()),
        encadreur: z.string().min(2),
        image: z.string().optional(),
        keywords: z.array(z.string()).default([]),
        facebook: z.string().optional(),
        linkedin: z.string().optional(),
        whatsapp: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const [filiere] = await db
        .select()
        .from(filieres)
        .where(eq(filieres.code, input.filiereCode));

      if (!filiere) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Filière introuvable." });
      }

      const existing = await db
        .select({ count: sql<number>`count(*)` })
        .from(memoires)
        .where(eq(memoires.userId, ctx.session.user.id));

      if (Number(existing[0].count) >= 3) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Vous avez atteint la limite de 3 publications." });
      }

      const slug = `${slugify(input.title)}-${Date.now().toString(36)}`;

      const [memoire] = await db
        .insert(memoires)
        .values({
          slug,
          title: input.title,
          summary: input.summary,
          image: input.image ?? null,
          annee: input.annee,
          niveau: input.niveau,
          encadreur: input.encadreur,
          domaine: input.domaine ?? null,
          parcours: input.parcours ?? null,
          facebook: input.facebook ?? null,
          linkedin: input.linkedin ?? null,
          whatsapp: input.whatsapp ?? null,
          userId: ctx.session.user.id,
          filiereId: filiere.id,
        })
        .returning();

      for (const raw of input.keywords) {
        const name = raw.trim();
        if (!name) continue;
        const [kw] = await db.insert(keywords).values({ name }).onConflictDoNothing().returning();
        let kwId = kw?.id;
        if (!kwId) {
          const [found] = await db.select().from(keywords).where(eq(keywords.name, name));
          kwId = found?.id;
        }
        if (kwId) {
          await db.insert(memoireKeywords).values({ memoireId: memoire.id, keywordId: kwId }).onConflictDoNothing();
        }
      }

      return memoire;
    }),

  update: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
        title: z.string().min(3),
        summary: z.string().min(10),
        filiereCode: z.string().min(1),
        domaine: z.string().optional(),
        parcours: z.string().optional(),
        niveau: z.string().min(1),
        annee: z.number().int().min(1900).max(new Date().getFullYear()),
        encadreur: z.string().min(2),
        image: z.string().optional(),
        keywords: z.array(z.string()).default([]),
        facebook: z.string().optional(),
        linkedin: z.string().optional(),
        whatsapp: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const [row] = await db.select({ id: memoires.id, userId: memoires.userId }).from(memoires).where(eq(memoires.slug, input.slug));
      if (!row) throw new TRPCError({ code: "NOT_FOUND", message: "Mémoire introuvable." });
      if (row.userId !== ctx.session.user.id) throw new TRPCError({ code: "FORBIDDEN", message: "Non autorisé." });

      const [filiere] = await db.select().from(filieres).where(eq(filieres.code, input.filiereCode));
      if (!filiere) throw new TRPCError({ code: "BAD_REQUEST", message: "Filière introuvable." });

      await db.update(memoires).set({
        title: input.title,
        summary: input.summary,
        image: input.image ?? null,
        annee: input.annee,
        niveau: input.niveau,
        encadreur: input.encadreur,
        domaine: input.domaine ?? null,
        parcours: input.parcours ?? null,
        facebook: input.facebook ?? null,
        linkedin: input.linkedin ?? null,
        whatsapp: input.whatsapp ?? null,
        filiereId: filiere.id,
      }).where(eq(memoires.id, row.id));

      await db.delete(memoireKeywords).where(eq(memoireKeywords.memoireId, row.id));

      for (const raw of input.keywords) {
        const name = raw.trim();
        if (!name) continue;
        const [kw] = await db.insert(keywords).values({ name }).onConflictDoNothing().returning();
        let kwId = kw?.id;
        if (!kwId) {
          const [found] = await db.select().from(keywords).where(eq(keywords.name, name));
          kwId = found?.id;
        }
        if (kwId) {
          await db.insert(memoireKeywords).values({ memoireId: row.id, keywordId: kwId }).onConflictDoNothing();
        }
      }

      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const [row] = await db.select({ id: memoires.id, userId: memoires.userId }).from(memoires).where(eq(memoires.slug, input.slug));
      if (!row) throw new TRPCError({ code: "NOT_FOUND", message: "Mémoire introuvable." });
      if (row.userId !== ctx.session.user.id) throw new TRPCError({ code: "FORBIDDEN", message: "Non autorisé." });

      await db.delete(memoires).where(eq(memoires.id, row.id));
      return { success: true };
    }),
});