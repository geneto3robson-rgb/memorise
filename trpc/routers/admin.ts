import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq, sql, desc } from "drizzle-orm";
import { protectedProcedure, router } from "../init";
import { db } from "@/db";
import { profiles, memoires, filieres } from "@/db/schema";
import { user } from "@/db/auth-schema";

// Middleware pour vérifier si l'utilisateur est admin
const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const [profile] = await db.select().from(profiles).where(eq(profiles.userId, ctx.session.user.id));
  
  if (!profile || profile.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Accès réservé aux administrateurs." });
  }
  
  return next({ ctx });
});

export const adminRouter = router({
  // Récupérer les statistiques globales
  getStats: adminProcedure.query(async () => {
    const [usersCount] = await db.select({ count: sql<number>`count(*)` }).from(user);
    const [memoiresCount] = await db.select({ count: sql<number>`count(*)` }).from(memoires);
    
    // On récupère les 5 derniers mémoires publiés
    const recentMemoires = await db
      .select({
        id: memoires.id,
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
      recentMemoires,
    };
  }),

  // Lister tous les utilisateurs (pour la page Utilisateurs)
  listUsers: adminProcedure.query(async () => {
    return db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: profiles.role,
        filiereId: profiles.filiereId,
      })
      .from(user)
      .leftJoin(profiles, eq(user.id, profiles.userId))
      .orderBy(desc(user.createdAt));
  }),
});