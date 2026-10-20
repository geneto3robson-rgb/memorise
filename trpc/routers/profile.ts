import { z } from "zod";
import { eq } from "drizzle-orm";
import { protectedProcedure, router } from "../init";
import { db } from "@/db";
import { profiles, filieres } from "@/db/schema";

export const profileRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    try {
      const [p] = await db
        .select({ 
          profile: profiles, 
          filiereCode: filieres.code 
        })
        .from(profiles)
        .leftJoin(filieres, eq(profiles.filiereId, filieres.id))
        .where(eq(profiles.userId, ctx.session.user.id));
        
      return { 
        profile: p?.profile || null, 
        filiereCode: p?.filiereCode || null 
      };
    } catch (error) {
      // On capture l'erreur pour éviter que le site ne plante
      console.error("Erreur profile.get:", error);
      return { profile: null, filiereCode: null };
    }
  }), // Le try est maintenant correctement fermé

  update: protectedProcedure
    .input(
      z.object({
        role: z.string().optional(),
        filiereCode: z.string().nullish(),
        parcours: z.string().optional(),
        statut: z.string().optional(),
        facebook: z.string().optional(),
        linkedin: z.string().optional(),
        whatsapp: z.string().optional(),
        notifyNews: z.boolean().optional(),
        notifyPublications: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const existingProfile = await db.select().from(profiles).where(eq(profiles.userId, ctx.session.user.id));

      let finalFiliereId: number | null = null;
      if (input.filiereCode) {
        const [f] = await db.select().from(filieres).where(eq(filieres.code, input.filiereCode));
        if (f) finalFiliereId = f.id;
      }

      const profileData = {
        role: input.role || "etudiant",
        filiereId: finalFiliereId, 
        parcours: input.parcours || null,
        statut: input.statut || "Étudiant actuel",
        facebook: input.facebook || null,
        linkedin: input.linkedin || null,
        whatsapp: input.whatsapp || null,
        notifyNews: input.notifyNews,
        notifyPublications: input.notifyPublications,
      };

      if (existingProfile.length > 0) {
        await db.update(profiles).set(profileData).where(eq(profiles.userId, ctx.session.user.id));
      } else {
        await db.insert(profiles).values({ userId: ctx.session.user.id, ...profileData });
      }
      return { success: true };
    }),
});