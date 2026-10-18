import { z } from "zod";
import { eq } from "drizzle-orm";
import { protectedProcedure, router } from "../init";
import { db } from "@/db";
import { profiles, filieres } from "@/db/schema";

export const profileRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    // 👇 On fait une jointure pour récupérer le code de la filière
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
  }),

  update: protectedProcedure
    .input(
      z.object({
        role: z.string().optional(),
        filiereCode: z.string().nullish(), // 👈 On demande le CODE (ex: "TCO") et non l'ID
        parcours: z.string().optional(),
        facebook: z.string().optional(),
        linkedin: z.string().optional(),
        whatsapp: z.string().optional(),
        notifyNews: z.boolean().optional(),
        notifyPublications: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const existingProfile = await db.select().from(profiles).where(eq(profiles.userId, ctx.session.user.id));

      // 👇 On cherche l'ID numérique correspondant au code envoyé par le frontend
      let finalFiliereId: number | null = null;
      if (input.filiereCode) {
        const [f] = await db.select().from(filieres).where(eq(filieres.code, input.filiereCode));
        if (f) finalFiliereId = f.id;
      }

      const profileData = {
        role: input.role || "etudiant",
        filiereId: finalFiliereId, // 👈 On enregistre le bon ID numérique en BDD
        parcours: input.parcours || null,
        facebook: input.facebook || null,
        linkedin: input.linkedin || null,
        whatsapp: input.whatsapp || null,
        notifyNews: input.notifyNews,
        notifyPublications: input.notifyPublications,
      };

      if (existingProfile.length > 0) {
        await db.update(profiles).set(profileData).where(eq(profiles.userId, ctx.session.user.id));
      } else {
        await db.insert(profiles).values({
          userId: ctx.session.user.id,
          ...profileData,
        });
      }
      return { success: true };
    }),
});