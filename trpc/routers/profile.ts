import { z } from "zod";
import { eq } from "drizzle-orm";
import { protectedProcedure, router } from "../init";
import { db } from "@/db";
import { profiles } from "@/db/schema";

export const profileRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    const [p] = await db.select().from(profiles).where(eq(profiles.userId, ctx.session.user.id));
    return { profile: p || null };
  }),

  update: protectedProcedure
    .input(
      z.object({
        role: z.string().optional(),
        filiereId: z.number().nullish(),
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

      const profileData = {
        role: input.role || "etudiant",
        filiereId: input.filiereId ?? null,
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