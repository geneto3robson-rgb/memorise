import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq, sql, desc, and } from "drizzle-orm";
import { publicProcedure, protectedProcedure, router } from "../init";
import { db } from "@/db";
import { memoires, filieres, keywords, memoireKeywords, profiles, notifications } from "@/db/schema";
import { user } from "@/db/auth-schema";

function slugify(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
}

export const memoireRouter = router({
  // 👇 CORRECTION 1 : On renvoie le filiereCode pour le frontend
  myProfile: protectedProcedure.query(async ({ ctx }) => {
    const [row] = await db.select({ 
      profile: profiles, 
      filiereCode: filieres.code 
    })
    .from(profiles)
    .leftJoin(filieres, eq(profiles.filiereId, filieres.id))
    .where(eq(profiles.userId, ctx.session.user.id));
    
    return row ? { ...row.profile, filiereCode: row.filiereCode } : null;
  }),

  notifyProfileIncomplete: protectedProcedure.mutation(async ({ ctx }) => {
    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, ctx.session.user.id));
    const isProfileIncomplete = !profile || !profile.parcours || !profile.whatsapp;
    if (isProfileIncomplete) {
      const existing = await db.select().from(notifications).where(and(eq(notifications.userId, ctx.session.user.id), eq(notifications.message, "Veuillez compléter votre profil pour personnaliser votre espace et faciliter vos publications.")));
      if (existing.length === 0) {
        await db.insert(notifications).values({ userId: ctx.session.user.id, message: "Veuillez compléter votre profil pour personnaliser votre espace et faciliter vos publications.", link: "/parametres", isRead: false, createdAt: new Date() });
      }
    }
    return { success: true };
  }),

  list: publicProcedure
    .input(
      z.object({
        search: z.string().default(""),
        filiere: z.string().default(""),
        domaine: z.string().default(""),
        parcours: z.string().default(""),
        niveau: z.string().default(""),
        annee: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      const rows = await db
        .select({
          id: memoires.id, slug: memoires.slug, title: memoires.title, summary: memoires.summary,
          image: memoires.image, annee: memoires.annee, niveau: memoires.niveau,
          encadreur: memoires.encadreur, domaine: memoires.domaine, parcours: memoires.parcours,
          filiereName: filieres.name, filiereCode: filieres.code,
          authorName: user.name, authorImage: user.image, createdAt: memoires.createdAt,
        })
        .from(memoires)
        .leftJoin(filieres, eq(memoires.filiereId, filieres.id))
        .leftJoin(user, eq(memoires.userId, user.id))
        .orderBy(desc(memoires.id));

      return rows.filter((r) => {
        const q = input.search.toLowerCase().trim();
        const matchTitle = r.title.toLowerCase().includes(q);
        const matchAuthor = r.authorName?.toLowerCase().includes(q);
        if (q && !matchTitle && !matchAuthor) return false;
        
        if (input.filiere && r.filiereCode !== input.filiere) return false;
        if (input.domaine && r.domaine !== input.domaine) return false;
        if (input.parcours && r.parcours !== input.parcours) return false;
        if (input.niveau && r.niveau !== input.niveau) return false;
        if (input.annee && r.annee !== input.annee) return false;
        return true;
      });
    }),

  recent: publicProcedure.query(async () => {
    return db.select({
        id: memoires.id, slug: memoires.slug, title: memoires.title, summary: memoires.summary,
        image: memoires.image, annee: memoires.annee, niveau: memoires.niveau,
        encadreur: memoires.encadreur, domaine: memoires.domaine,
        filiereName: filieres.name, filiereCode: filieres.code,
        authorName: user.name, authorImage: user.image,
      }).from(memoires).leftJoin(filieres, eq(memoires.filiereId, filieres.id)).leftJoin(user, eq(memoires.userId, user.id)).orderBy(desc(memoires.id)).limit(4);
  }),

  mine: protectedProcedure.query(async ({ ctx }) => {
    return db.select({
        id: memoires.id, slug: memoires.slug, title: memoires.title, summary: memoires.summary,
        image: memoires.image, annee: memoires.annee, niveau: memoires.niveau,
        encadreur: memoires.encadreur, domaine: memoires.domaine,
        filiereName: filieres.name, filiereCode: filieres.code, createdAt: memoires.createdAt,
      }).from(memoires).leftJoin(filieres, eq(memoires.filiereId, filieres.id)).where(eq(memoires.userId, ctx.session.user.id)).orderBy(desc(memoires.id));
  }),

  bySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
      const [row] = await db.select({
          id: memoires.id, slug: memoires.slug, title: memoires.title, summary: memoires.summary,
          image: memoires.image, annee: memoires.annee, niveau: memoires.niveau,
          encadreur: memoires.encadreur, domaine: memoires.domaine, parcours: memoires.parcours,
          facebook: memoires.facebook, linkedin: memoires.linkedin, whatsapp: memoires.whatsapp,
          filiereName: filieres.name, filiereCode: filieres.code,
          authorName: user.name, authorImage: user.image, authorId: user.id,
        }).from(memoires).leftJoin(filieres, eq(memoires.filiereId, filieres.id)).leftJoin(user, eq(memoires.userId, user.id)).where(eq(memoires.slug, input.slug));
      if (!row) return null;
      const kws = await db.select({ name: keywords.name }).from(memoireKeywords).leftJoin(keywords, eq(memoireKeywords.keywordId, keywords.id)).where(eq(memoireKeywords.memoireId, row.id));
      return { ...row, keywords: kws.map((k) => k.name ?? "").filter(Boolean) };
    }),

  // 👇 CORRECTION 2 : Sécurité à la création
  create: protectedProcedure.input(z.object({
        title: z.string().min(3), summary: z.string().min(10), filiereCode: z.string().min(1),
        domaine: z.string().optional(), parcours: z.string().optional(), niveau: z.string().min(1),
        annee: z.number().int().min(1900).max(new Date().getFullYear()), encadreur: z.string().min(2),
        image: z.string().optional(), keywords: z.array(z.string()).default([]),
        facebook: z.string().optional(), linkedin: z.string().optional(), whatsapp: z.string().optional(),
      })).mutation(async ({ input, ctx }) => {
      
      // On récupère le profil
      const [userProfile] = await db.select().from(profiles).where(eq(profiles.userId, ctx.session.user.id));
      
      let finalFiliereId: number;

      // Si le profil a une filière, on l'impose. Sinon, on utilise celle du formulaire.
      if (userProfile && userProfile.filiereId) {
        finalFiliereId = userProfile.filiereId;
      } else {
        const [filiere] = await db.select().from(filieres).where(eq(filieres.code, input.filiereCode));
        if (!filiere) throw new TRPCError({ code: "BAD_REQUEST", message: "Filière introuvable." });
        finalFiliereId = filiere.id;
      }

      const existing = await db.select({ count: sql<number>`count(*)` }).from(memoires).where(eq(memoires.userId, ctx.session.user.id));
      if (Number(existing[0].count) >= 3) throw new TRPCError({ code: "FORBIDDEN", message: "Vous avez atteint la limite de 3 publications." });

      const slug = `${slugify(input.title)}-${Date.now().toString(36)}`;
      const [memoire] = await db.insert(memoires).values({
          slug, title: input.title, summary: input.summary, image: input.image ?? null,
          annee: input.annee, niveau: input.niveau, encadreur: input.encadreur,
          domaine: input.domaine ?? null, parcours: input.parcours ?? null,
          facebook: input.facebook ?? null, linkedin: input.linkedin ?? null, whatsapp: input.whatsapp ?? null,
          userId: ctx.session.user.id, filiereId: finalFiliereId, // Utilisation de la filière sécurisée
        }).returning();

      for (const raw of input.keywords) {
        const name = raw.trim();
        if (!name) continue;
        const [kw] = await db.insert(keywords).values({ name }).onConflictDoNothing().returning();
        let kwId = kw?.id;
        if (!kwId) { const [found] = await db.select().from(keywords).where(eq(keywords.name, name)); kwId = found?.id; }
        if (kwId) await db.insert(memoireKeywords).values({ memoireId: memoire.id, keywordId: kwId }).onConflictDoNothing();
      }
      await db.insert(notifications).values({ userId: ctx.session.user.id, message: "Votre publication a bien été publiée avec succès.", link: `/memoires/${slug}`, isRead: false, createdAt: new Date() });
      return memoire;
    }),

  // 👇 CORRECTION 3 : Sécurité à la modification
  update: protectedProcedure.input(z.object({
        slug: z.string(), title: z.string().min(3), summary: z.string().min(10), filiereCode: z.string().min(1),
        domaine: z.string().optional(), parcours: z.string().optional(), niveau: z.string().min(1),
        annee: z.number().int().min(1900).max(new Date().getFullYear()), encadreur: z.string().min(2),
        image: z.string().optional(), keywords: z.array(z.string()).default([]),
        facebook: z.string().optional(), linkedin: z.string().optional(), whatsapp: z.string().optional(),
      })).mutation(async ({ input, ctx }) => {
      const [row] = await db.select({ id: memoires.id, userId: memoires.userId }).from(memoires).where(eq(memoires.slug, input.slug));
      if (!row) throw new TRPCError({ code: "NOT_FOUND", message: "Mémoire introuvable." });
      if (row.userId !== ctx.session.user.id) throw new TRPCError({ code: "FORBIDDEN", message: "Non autorisé." });
      
      const [userProfile] = await db.select().from(profiles).where(eq(profiles.userId, ctx.session.user.id));
      let finalFiliereId: number;

      if (userProfile && userProfile.filiereId) {
        finalFiliereId = userProfile.filiereId;
      } else {
        const [filiere] = await db.select().from(filieres).where(eq(filieres.code, input.filiereCode));
        if (!filiere) throw new TRPCError({ code: "BAD_REQUEST", message: "Filière introuvable." });
        finalFiliereId = filiere.id;
      }

      await db.update(memoires).set({
          title: input.title, summary: input.summary, image: input.image ?? null,
          annee: input.annee, niveau: input.niveau, encadreur: input.encadreur,
          domaine: input.domaine ?? null, parcours: input.parcours ?? null,
          facebook: input.facebook ?? null, linkedin: input.linkedin ?? null, whatsapp: input.whatsapp ?? null,
          filiereId: finalFiliereId,
        }).where(eq(memoires.id, row.id));

      await db.delete(memoireKeywords).where(eq(memoireKeywords.memoireId, row.id));
      for (const raw of input.keywords) {
        const name = raw.trim();
        if (!name) continue;
        const [kw] = await db.insert(keywords).values({ name }).onConflictDoNothing().returning();
        let kwId = kw?.id;
        if (!kwId) { const [found] = await db.select().from(keywords).where(eq(keywords.name, name)); kwId = found?.id; }
        if (kwId) await db.insert(memoireKeywords).values({ memoireId: row.id, keywordId: kwId }).onConflictDoNothing();
      }
      await db.insert(notifications).values({ userId: ctx.session.user.id, message: "Votre publication a bien été modifiée avec succès.", link: `/memoires/${input.slug}`, isRead: false, createdAt: new Date() });
      return { success: true };
    }),

  delete: protectedProcedure.input(z.object({ slug: z.string() })).mutation(async ({ input, ctx }) => {
      const [row] = await db.select({ id: memoires.id, userId: memoires.userId }).from(memoires).where(eq(memoires.slug, input.slug));
      if (!row) throw new TRPCError({ code: "NOT_FOUND", message: "Mémoire introuvable." });
      if (row.userId !== ctx.session.user.id) throw new TRPCError({ code: "FORBIDDEN", message: "Non autorisé." });
      await db.delete(memoires).where(eq(memoires.id, row.id));
      return { success: true };
    }),

  notifyContact: protectedProcedure.input(z.object({ memoireId: z.number() })).mutation(async ({ input, ctx }) => {
      const [memoire] = await db.select({ userId: memoires.userId, title: memoires.title, slug: memoires.slug }).from(memoires).where(eq(memoires.id, input.memoireId));
      if (memoire && memoire.userId !== ctx.session.user.id) {
        await db.insert(notifications).values({ userId: memoire.userId, message: `Quelqu'un souhaite vous contacter pour votre mémoire "${memoire.title.substring(0, 20)}..."`, link: `/memoires/${memoire.slug}`, isRead: false, createdAt: new Date() });
      }
      return { success: true };
    }),
});