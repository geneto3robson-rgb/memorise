import {
  pgTable, serial, text, integer, timestamp, primaryKey,
} from "drizzle-orm/pg-core";

export const poles = pgTable("poles", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
});

export const filieres = pgTable("filieres", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  poleId: integer("pole_id").notNull().references(() => poles.id),
});

export const profiles = pgTable("profiles", {
  userId: text("user_id").primaryKey(),
  role: text("role").notNull().default("etudiant"),
  filiereId: integer("filiere_id").references(() => filieres.id),
  parcours: text("parcours"),
  facebook: text("facebook"),
  linkedin: text("linkedin"),
  whatsapp: text("whatsapp"),
});

export const memoires = pgTable("memoires", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  image: text("image"),
  annee: integer("annee").notNull(),
  niveau: text("niveau").notNull(),
  encadreur: text("encadreur").notNull(),
  pages: integer("pages"),
  userId: text("user_id").notNull(),
  filiereId: integer("filiere_id").notNull().references(() => filieres.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const keywords = pgTable("keywords", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const memoireKeywords = pgTable("memoire_keywords", {
  memoireId: integer("memoire_id").notNull().references(() => memoires.id, { onDelete: "cascade" }),
  keywordId: integer("keyword_id").notNull().references(() => keywords.id, { onDelete: "cascade" }),
}, (t) => ({
  pk: primaryKey({ columns: [t.memoireId, t.keywordId] }),
}));

export const favoris = pgTable("favoris", {
  userId: text("user_id").notNull(),
  memoireId: integer("memoire_id").notNull().references(() => memoires.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.memoireId] }),
}));