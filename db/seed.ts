import { db } from "@/db"; // 👈 Si l'erreur persiste, remplace "./index" par "@/db"
import { filieres, poles } from "@/lib/data/filieres";
import { 
  filieres as filieresSchema, 
  poles as polesSchema 
} from "./schema"; // 👈 Vérifie que le fichier s'appelle bien schema.ts

async function seed() {
  console.log("🌱 Début du peuplement de la base de données...");

  try {
    // 1. Nettoyage (dans l'ordre pour éviter les erreurs de clés étrangères)
    console.log("🧹 Suppression des anciennes données...");
    await db.delete(filieresSchema);
    await db.delete(polesSchema);

    // 2. Insertion des Pôles
    console.log("📥 Insertion des pôles...");
    const insertedPoles = await db
      .insert(polesSchema)
      .values(
        poles.map((p: any) => ({
          code: p.code,
          name: p.name,
        }))
      )
      .returning();

    // 3. Création d'un dictionnaire de correspondance (Code du pôle -> ID numérique de la BDD)
    // Ex: { "gpi": 1, "gc": 2, "gsti": 3, "gstm": 4 }
    const poleIdMap = new Map<string, number>();
    insertedPoles.forEach((p) => {
      // On met en minuscule pour être sûr que ça corresponde au fichier statique
      poleIdMap.set(p.code.toLowerCase(), p.id); 
    });

    // 4. Insertion des Filières
    console.log("📥 Insertion des filières...");
    const dataToInsert = filieres.map((f: any) => {
      const numericPoleId = poleIdMap.get(f.poleId.toLowerCase());

      if (!numericPoleId) {
        throw new Error(`Le pôle avec le code "${f.poleId}" n'a pas été trouvé pour la filière ${f.code}`);
      }

      return {
        code: f.code, // Ex: "IMIN", "GGEO", "MTO"
        name: f.name,
        poleId: numericPoleId, // L'ID numérique généré par PostgreSQL
      };
    });

    await db.insert(filieresSchema).values(dataToInsert);

    console.log("✅ Seeding terminé avec succès !");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur lors du seeding :", error);
    process.exit(1);
  }
}

// Lancement de la fonction
seed();