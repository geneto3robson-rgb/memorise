import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import * as authSchema from "./auth-schema";

const url = process.env.DATABASE_URL?.trim();
if (!url) throw new Error("DATABASE_URL manquant dans .env");

export const db = drizzle(url, { schema: { ...schema, ...authSchema } });