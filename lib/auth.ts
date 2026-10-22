import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { user, session, account, verification } from "@/db/auth-schema";
import { profiles } from "@/db/schema";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, session, account, verification },
  }),
  emailAndPassword: { enabled: true },
  
  trustedOrigins: [
    "http://localhost:3000", 
    "http://localhost:3001",
    "https://memorise-roan.vercel.app", // mon URL de production
    "https://*.vercel.app" // Autorise toutes les URL de prévisualisation générées par Vercel
  ],
  
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
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
            console.error("Erreur profil:", error);
          }
        },
      },
    },
  },
});