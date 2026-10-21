// trpc/routers/admin.ts
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq, sql, desc } from "drizzle-orm";
import { protectedProcedure, router } from "../init";
import { db } from "@/db";
import { profiles, memoires, filieres } from "@/db/schema";
import { user } from "@/db/auth-schema";

const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const [profile] = await db.select().from(profiles).where(eq(profiles.userId, ctx.session.user.id));
  if (!profile || profile.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Accès réservé aux administrateurs." });
  }
  return next({ ctx });
});

export const adminRouter = router({
  getStats: adminProcedure.query(async () => {
    const [usersCount] = await db.select({ count: sql<number>`count(*)` }).from(user);
    const [memoiresCount] = await db.select({ count: sql<number>`count(*)` }).from(memoires);
    const [filieresCount] = await db.select({ count: sql<number>`count(*)` }).from(filieres);
    
    const recentMemoires = await db
      .select({
        id: memoires.id,
        slug: memoires.slug,
        title: memoires.title,
        createdAt: memoires.createdAt,
        authorName: user.name,
        filiereName: filieres.name,
      })
      .from(memoires)
      .leftJoin(user, eq(memoires.userId, user.id))
      .leftJoin(filieres, eq(memoires.filiereId, filieres.id))
      .orderBy(desc(memoires.createdAt))
      .limit(5);

    return {
      totalUsers: Number(usersCount.count),
      totalMemoires: Number(memoiresCount.count),
      totalFilieres: Number(filieresCount.count),
      recentMemoires,
    };
  }),

  listAllMemoires: adminProcedure.query(async () => {
    return db
      .select({
        id: memoires.id,
        slug: memoires.slug,
        title: memoires.title,
        annee: memoires.annee,
        niveau: memoires.niveau,
        authorName: user.name,
        filiereName: filieres.name,
      })
      .from(memoires)
      .leftJoin(user, eq(memoires.userId, user.id))
      .leftJoin(filieres, eq(memoires.filiereId, filieres.id))
      .orderBy(desc(memoires.createdAt));
  }),

  listUsers: adminProcedure.query(async () => {
    return db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: profiles.role,
        filiereId: profiles.filiereId,
        filiereName: filieres.name,
        filiereCode: filieres.code,
      })
      .from(user)
      .leftJoin(profiles, eq(user.id, profiles.userId))
      .leftJoin(filieres, eq(profiles.filiereId, filieres.id))
      .orderBy(desc(user.createdAt));
  }),

  deleteMemoire: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(memoires).where(eq(memoires.id, input.id));
      return { success: true };
    }),

  // 👇 NOUVELLE FONCTION POUR SUPPRIMER UN UTILISATEUR 👇
  deleteUser: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      // Supprime d'abord le profil (si pas de cascade), puis l'utilisateur
      await db.delete(profiles).where(eq(profiles.userId, input.id));
      await db.delete(user).where(eq(user.id, input.id));
      return { success: true };
    }),
});