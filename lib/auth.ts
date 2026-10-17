import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { user, session, account, verification } from "@/db/auth-schema";
import { profiles } from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, session, account, verification },
  }),
  emailAndPassword: { enabled: true },
  trustedOrigins: ["http://localhost:3000"],
  databaseHooks: {
    user: {
      create: {
        after: async (newUser) => {
          try {
            await db.insert(profiles).values({
              userId: newUser.id,
              role: "etudiant",
            });
          } catch (error) {
            console.error("Erreur lors de la création du profil :", error);
          }
        },
      },
    },
  },
});